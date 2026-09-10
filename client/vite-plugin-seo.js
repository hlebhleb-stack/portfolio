import fs from 'node:fs'
import path from 'node:path'
import { SITE_NAME, ROUTES, LOCALES, metaForRoute } from './src/siteMeta.js'

// The site is a client-rendered SPA, so a crawler that does not execute
// JavaScript sees an empty <div id="root">. X, Telegram, Slack, iMessage and
// LinkedIn all build their link previews without running JS, which means the
// only <head> they ever read is the static one Vite emits.
//
// This plugin emits a real HTML file per route (dist/case/<slug>/index.html)
// carrying that route's own title, description and share image. Vercel matches
// static files before it applies the rewrite in vercel.json, so those files are
// served for the case URLs and the SPA rewrite only catches everything else.

const SEO_BLOCK_RE = /<!--seo-->[\s\S]*?<!--\/seo-->/

// The canonical production origin. Deliberately not read from
// VERCEL_PROJECT_PRODUCTION_URL, which resolves to the .vercel.app domain:
// canonical URLs and share images should point at the custom domain from
// every deployment, previews included, so search engines and link previews
// agree on one address. The apex redirects here with a 307, so www is the
// form to publish.
const PRODUCTION_ORIGIN = 'https://www.glebaagleb.com'

function resolveSiteUrl() {
  const explicit = process.env.SITE_URL || process.env.VITE_SITE_URL
  return (explicit || PRODUCTION_ORIGIN).replace(/\/+$/, '')
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}

function seoBlock(route, siteUrl, lang = 'en') {
  const meta = metaForRoute(route, lang)
  const url = `${siteUrl}${route === '/' ? '/' : route}`
  const image = `${siteUrl}${meta.image}`
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)
  const alternates = Object.entries(LOCALES)
    .filter(([code]) => code !== lang)
    .map(([, locale]) => `    <meta property="og:locale:alternate" content="${locale}" />`)

  return [
    '<!--seo-->',
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <link rel="canonical" href="${escapeAttr(url)}" />`,
    '    <meta name="robots" content="index, follow" />',
    `    <meta name="author" content="${escapeAttr(SITE_NAME)}" />`,
    '    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />',
    '    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />',
    '',
    `    <meta property="og:type" content="${route === '/' ? 'website' : 'article'}" />`,
    `    <meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `    <meta property="og:locale" content="${LOCALES[lang] || LOCALES.en}" />`,
    ...alternates,
    `    <meta property="og:url" content="${escapeAttr(url)}" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:image" content="${escapeAttr(image)}" />`,
    '    <meta property="og:image:width" content="1200" />',
    '    <meta property="og:image:height" content="630" />',
    `    <meta property="og:image:alt" content="${title}" />`,
    '',
    '    <meta name="twitter:card" content="summary_large_image" />',
    '    <meta name="twitter:creator" content="@glebaagleb" />',
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${escapeAttr(image)}" />`,
    '    <!--/seo-->',
  ].join('\n')
}

export default function seoPlugin() {
  let outDir = 'dist'
  let siteUrl = ''

  return {
    name: 'seo-prerender',

    configResolved(config) {
      outDir = config.build.outDir
      siteUrl = resolveSiteUrl()
    },

    // Dev server: only resolve the placeholder so local pages are not full of
    // literal %SITE_URL% strings. Per-route heads are a build-time concern.
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl || 'http://localhost:5173')
    },

    closeBundle() {
      const root = path.resolve(outDir)
      const indexPath = path.join(root, 'index.html')
      if (!fs.existsSync(indexPath)) return

      const html = fs.readFileSync(indexPath, 'utf-8')
      if (!SEO_BLOCK_RE.test(html)) {
        this.warn('seo markers not found in index.html — per-route heads skipped')
        return
      }

      for (const route of ROUTES) {
        const page = html.replace(SEO_BLOCK_RE, seoBlock(route, siteUrl))
        if (route === '/') {
          fs.writeFileSync(indexPath, page)
          continue
        }
        // Written under both conventions on purpose. Static hosts disagree on
        // how they resolve an extensionless URL: some map /case/x to
        // case/x/index.html, others to case/x.html, and `vite preview` only
        // serves the directory form for /case/x/ with a trailing slash.
        // Emitting both means the case URL resolves to a real file either way,
        // and never falls through to the SPA rewrite with the generic head.
        const rel = route.replace(/^\//, '')
        for (const file of [path.join(root, rel, 'index.html'), path.join(root, `${rel}.html`)]) {
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(file, page)
        }
      }

      const today = new Date().toISOString().slice(0, 10)
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...ROUTES.map((route) =>
          [
            '  <url>',
            `    <loc>${siteUrl}${route === '/' ? '/' : route}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>`,
            '  </url>',
          ].join('\n')
        ),
        '</urlset>',
        '',
      ].join('\n')
      fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap)

      const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n')
      fs.writeFileSync(path.join(root, 'robots.txt'), robots)
    },
  }
}

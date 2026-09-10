import { useEffect } from 'react'
import { metaForRoute, LOCALES, SITE_NAME } from './siteMeta.js'

// The build-time half of this (vite-plugin-seo.js) is what link-preview
// crawlers read, since none of them run JavaScript. This runtime half covers
// what the prerendered files cannot: the tab title as the SPA navigates
// between cases without a document load, and the language toggle, which
// changes the copy without changing the URL.

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [, kind, name] = /\[(property|name)="([^"]+)"\]/.exec(selector) || []
    if (!kind) return
    el.setAttribute(kind, name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export default function useDocumentMeta(pathname, lang) {
  useEffect(() => {
    const meta = metaForRoute(pathname, lang)
    const origin = window.location.origin
    const url = origin + pathname
    const image = origin + meta.image

    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:image"]', 'content', image)
    setMeta('meta[property="og:image:alt"]', 'content', meta.title)
    setMeta('meta[property="og:site_name"]', 'content', SITE_NAME)
    setMeta('meta[property="og:locale"]', 'content', LOCALES[lang] || LOCALES.en)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
    setMeta('meta[name="twitter:image"]', 'content', image)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [pathname, lang])
}

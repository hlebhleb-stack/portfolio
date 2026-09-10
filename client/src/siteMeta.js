// Per-route metadata: page titles, meta descriptions and share-card images.
//
// Used from two places, so this file stays plain data with no JSX and no
// `import.meta` — the Vite plugin imports it in Node at build time to
// prerender a real <head> for each case route, and useDocumentMeta.js
// imports it in the browser to keep the tab title and the tags in sync as
// the SPA navigates.
//
// Crawlers that build link previews (X, Telegram, Slack, iMessage) do not
// run JavaScript, so the prerendered copy is the one that actually shows up
// when a case link is shared. The runtime half only fixes up the tab title
// and helps Google, which does render.

export const SITE_NAME = 'Gleb Dihtievsky'

export const DEFAULT_OG_IMAGE = '/assets/og/og-default.png'

export const LOCALES = { en: 'en_US', ru: 'ru_RU' }

const home = {
  en: {
    title: 'Gleb Dihtievsky, Graphic & Motion Designer',
    description:
      'Graphic and motion designer working with fintech and crypto brands. Motion videos, social content, brand systems and product documentation for Colb Finance, Sova Labs and Re Protocol.',
    image: DEFAULT_OG_IMAGE,
  },
  ru: {
    title: 'Глеб Дихтиевский, графический и моушн-дизайнер',
    description:
      'Графический и моушн-дизайнер, работаю с финтех- и крипто-брендами. Моушн-видео, контент для соцсетей, бренд-системы и продуктовая документация для Colb Finance, Sova Labs и Re Protocol.',
    image: DEFAULT_OG_IMAGE,
  },
}

// Kept as plain strings on purpose: translations.jsx stores some case
// descriptions as JSX fragments (they carry inline links), which cannot be
// serialised into a meta tag.
const cases = {
  'colb-finance': {
    en: {
      title: 'Colb Finance · Gleb Dihtievsky',
      description:
        'X content design for a Swiss fintech project. A consistent visual language built out of motion graphics, infographics and announcement assets, translating dense financial mechanics into focused posts.',
      image: '/assets/og/og-colb-finance.png',
    },
    ru: {
      title: 'Colb Finance · Глеб Дихтиевский',
      description:
        'Дизайн контента для X швейцарского финтех-проекта. Единый визуальный язык из моушн-графики, инфографики и анонсов, который переводит сложную финансовую механику в понятные посты.',
      image: '/assets/og/og-colb-finance.png',
    },
  },
  'sova-labs': {
    en: {
      title: 'Sova Labs · Gleb Dihtievsky',
      description:
        'Creative direction, 2D motion design and marketing graphics for a DeFi platform. Five motion videos and a reusable template system built to keep production fast and the brand consistent.',
      image: '/assets/og/og-sova-labs.png',
    },
    ru: {
      title: 'Sova Labs · Глеб Дихтиевский',
      description:
        'Креативное направление, 2D моушн-дизайн и маркетинговая графика для DeFi-платформы. Пять моушн-видео и система переиспользуемых шаблонов, которая ускоряет продакшн и держит бренд единым.',
      image: '/assets/og/og-sova-labs.png',
    },
  },
  're-protocol': {
    en: {
      title: 'Re Protocol · Gleb Dihtievsky',
      description:
        'Explainer and promotional animations for a reinsurance protocol, made with a 3D designer. Text animation, compositing, sound design and final edit across five announcement videos.',
      image: DEFAULT_OG_IMAGE,
    },
    ru: {
      title: 'Re Protocol · Глеб Дихтиевский',
      description:
        'Объясняющие и промо-анимации для протокола перестрахования, сделанные в паре с 3D-дизайнером. Анимация текста, композитинг, саунд-дизайн и финальный монтаж пяти анонсных видео.',
      image: DEFAULT_OG_IMAGE,
    },
  },
}

export const CASE_SLUGS = Object.keys(cases)

// Routes worth prerendering and listing in the sitemap.
export const ROUTES = ['/', ...CASE_SLUGS.map((slug) => `/case/${slug}`)]

export function metaForRoute(pathname, lang = 'en') {
  const locale = home[lang] ? lang : 'en'
  const match = /^\/case\/([^/]+)\/?$/.exec(pathname)
  if (match && cases[match[1]]) return cases[match[1]][locale]
  return home[locale]
}

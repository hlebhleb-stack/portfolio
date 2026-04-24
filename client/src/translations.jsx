import React from 'react'

const threeDLink = (label) => (
  <a
    href="https://x.com/puselol"
    target="_blank"
    rel="noopener noreferrer"
    className="case-description-link"
  >
    {label}
  </a>
)

export const translations = {
  en: {
    fullName: 'Gleb Dihtievsky',
    heroBio: 'Gleb designs visual experiences. Focused on motion, brand, and UI. Currently creating vibes at Colb Finance.',
    heroBioHighlights: ['Gleb', 'Colb Finance'],
    heroRole: 'Visual Designer',
    experience: 'Experience',
    workRole: 'Visuals for X/Twitter',
    cv: 'CV',
    copy: '© 2026 Gleb Dihtievsky. All rights reserved.',
    filter: { all: 'All', videos: 'Videos', banners: 'Banners' },
    menu: { home: 'home', works: 'works', switchTheme: 'switch theme' },
    notFound: 'Case not found',
    periods: {
      'colb-finance': 'Sep 2025 — Present',
      'sova-labs': 'Jan 2026 — Present',
      're-protocol': 'Dec 2025 — Jan 2026',
    },
    cases: {
      'colb-finance': {
        description:
          'Full-cycle design for a Swiss fintech project: from high-fidelity web prototyping and technical documentation to brand graphics, motion design, and UI assets for Twitter and Discord.',
        skills: ['UX/UI', 'Web Prototyping', 'Brand Identity', 'Motion Design'],
      },
      'sova-labs': {
        description:
          'Spearheaded the end-to-end creative direction, including 2D motion design and high-impact marketing graphics. Developed a comprehensive system of reusable design templates to streamline future content production and ensure long-term brand consistency.',
        skills: ['Creative Direction', '2D Motion Design', 'Design System', 'Marketing Design'],
      },
      're-protocol': {
        description: (
          <>
            Partnered with a {threeDLink('3D designer')} to produce high-end explainer and promotional animations for the official X account. Managed the full cycle of video creation to enhance brand presence and community engagement.
          </>
        ),
        skills: ['Creative Direction', 'Motion Design', '3D Animation', 'Video Production'],
      },
    },
  },
  ru: {
    fullName: 'Глеб Дихтиевский',
    heroBio: 'Глеб создаёт визуальные впечатления. Фокус на моушн, бренде и UI. Сейчас делает вайбы в Colb Finance.',
    heroBioHighlights: ['Глеб', 'Colb Finance'],
    heroRole: 'Визуальный дизайнер',
    experience: 'Опыт работы',
    workRole: 'Визуалы для X/Twitter',
    cv: 'Резюме',
    copy: '© 2026 Глеб Дихтиевский. Все права защищены.',
    filter: { all: 'Все', videos: 'Видео', banners: 'Баннеры' },
    menu: { home: 'главная', works: 'работы', switchTheme: 'сменить тему' },
    notFound: 'Кейс не найден',
    periods: {
      'colb-finance': 'Сен 2025 — наст. время',
      'sova-labs': 'Янв 2026 — наст. время',
      're-protocol': 'Дек 2025 — Янв 2026',
    },
    cases: {
      'colb-finance': {
        description:
          'Полный цикл дизайна для швейцарского финтех-проекта: от детализированного веб-прототипирования и технической документации до брендовой графики, моушн-дизайна и UI-материалов для Twitter и Discord.',
        skills: ['UX/UI', 'Веб-прототипирование', 'Айдентика', 'Моушн-дизайн'],
      },
      'sova-labs': {
        description:
          'Вёл креативное направление от начала и до конца: 2D моушн-дизайн и маркетинговая графика высокого уровня. Разработал систему переиспользуемых шаблонов, чтобы ускорить производство контента и удерживать единство бренда.',
        skills: ['Креативное направление', '2D моушн-дизайн', 'Дизайн-система', 'Маркетинговый дизайн'],
      },
      're-protocol': {
        description: (
          <>
            В паре с {threeDLink('3D-дизайнером')} создавали высококачественные объяснительные и промо-анимации для официального X-аккаунта. Вёл полный цикл производства видео, чтобы усилить присутствие бренда и вовлечённость сообщества.
          </>
        ),
        skills: ['Креативное направление', 'Моушн-дизайн', '3D-анимация', 'Видеопродакшн'],
      },
    },
  },
  de: {
    fullName: 'Gleb Dihtievsky',
    heroBio: 'Gleb gestaltet visuelle Erlebnisse. Fokus auf Motion, Brand und UI. Erschafft gerade Vibes bei Colb Finance.',
    heroBioHighlights: ['Gleb', 'Colb Finance'],
    heroRole: 'Visueller Designer',
    experience: 'Erfahrung',
    workRole: 'Visuals für X/Twitter',
    cv: 'Lebenslauf',
    copy: '© 2026 Gleb Dihtievsky. Alle Rechte vorbehalten.',
    filter: { all: 'Alle', videos: 'Videos', banners: 'Banner' },
    menu: { home: 'Startseite', works: 'Arbeiten', switchTheme: 'Theme wechseln' },
    notFound: 'Fall nicht gefunden',
    periods: {
      'colb-finance': 'Sep 2025 — heute',
      'sova-labs': 'Jan 2026 — heute',
      're-protocol': 'Dez 2025 — Jan 2026',
    },
    cases: {
      'colb-finance': {
        description:
          'Full-Cycle-Design für ein Schweizer Fintech-Projekt: von detailliertem Web-Prototyping und technischer Dokumentation bis hin zu Markengrafik, Motion Design und UI-Assets für Twitter und Discord.',
        skills: ['UX/UI', 'Web-Prototyping', 'Markenidentität', 'Motion Design'],
      },
      'sova-labs': {
        description:
          'Leitete die gesamte Creative Direction, inklusive 2D-Motion-Design und wirkungsstarker Marketinggrafik. Entwickelte ein umfassendes System wiederverwendbarer Design-Vorlagen, um die Content-Produktion zu beschleunigen und die Markenkonsistenz langfristig zu sichern.',
        skills: ['Creative Direction', '2D Motion Design', 'Design System', 'Marketing Design'],
      },
      're-protocol': {
        description: (
          <>
            Gemeinsam mit einem {threeDLink('3D-Designer')} entstanden hochwertige Erklär- und Promo-Animationen für den offiziellen X-Account. Verantwortete den gesamten Videoproduktionsprozess, um Markenpräsenz und Community-Engagement zu stärken.
          </>
        ),
        skills: ['Creative Direction', 'Motion Design', '3D-Animation', 'Videoproduktion'],
      },
    },
  },
}

export const LANGS = [
  { code: 'en', label: 'En' },
  { code: 'ru', label: 'Ru' },
  { code: 'de', label: 'De' },
]

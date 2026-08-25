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
    heroRole: 'Graphic Designer',
    heroText: 'Designing for brands that move fast. Motion, graphics, and everything in between.',
    experience: 'Experience',
    workRoles: {
      'colb-finance': 'Full Time',
      'sova-labs': 'Freelance',
      're-protocol': 'Freelance',
    },
    cv: 'CV',
    theme: { light: 'Light', dark: 'Dark' },
    copy: '© 2026 Gleb Dihtievsky. All rights reserved.',
    filter: { all: 'All', videos: 'Videos', banners: 'Banners' },
    notFound: 'Case not found',
    periods: {
      'colb-finance': 'Sep 2025 – Present',
      'sova-labs': 'Jan 2026 – May 2026',
      're-protocol': 'Dec 2025 – Jan 2026',
    },
    cases: {
      'colb-finance': {
        description:
          'Twitter content design for a Swiss fintech project. Built a consistent visual language out of motion graphics, infographics, and announcement assets – translating dense financial mechanics into clear, focused posts.',
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
    heroRole: 'Графический дизайнер',
    heroText: 'Дизайн для брендов, которые двигаются быстро. Моушн, графика и всё, что между ними.',
    experience: 'Опыт работы',
    workRoles: {
      'colb-finance': 'Фуллтайм',
      'sova-labs': 'Фриланс',
      're-protocol': 'Фриланс',
    },
    cv: 'Резюме',
    theme: { light: 'Светлая', dark: 'Тёмная' },
    copy: '© 2026 Глеб Дихтиевский. Все права защищены.',
    filter: { all: 'Все', videos: 'Видео', banners: 'Баннеры' },
    notFound: 'Кейс не найден',
    periods: {
      'colb-finance': 'Сен 2025 – наст. время',
      'sova-labs': 'Янв 2026 – Май 2026',
      're-protocol': 'Дек 2025 – Янв 2026',
    },
    cases: {
      'colb-finance': {
        description:
          'Дизайн Twitter-контента для швейцарского финтех-проекта. Сформировал единый визуальный язык из моушн-графики, инфографики и анонсных материалов, переводящий сложные финансовые механики в чёткие и понятные посты.',
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
}

export const LANGS = [
  { code: 'en', label: 'En' },
  { code: 'ru', label: 'Ru' },
]

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

const docLink = (href, label) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="colb-inline-link"
  >
    {label}
  </a>
)

const socialLink = (href, label) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="home-follow-link"
  >
    {label}
  </a>
)

export const translations = {
  en: {
    fullName: 'Gleb Dihtievsky',
    heroRole: 'Graphic Designer',
    heroText: 'Designing for brands that move fast. Motion, graphics, and everything in between.',
    followText: (
      <>
        Follow me on {socialLink('https://x.com/glebaagleb', 'X')}, {socialLink('https://t.me/glebaagleb', 'Telegram')}, {socialLink('https://www.behance.net/gleb_diht', 'Behance')}, and {socialLink('https://www.linkedin.com/in/gleb-dihtievsky/', 'LinkedIn')}.
      </>
    ),
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
        nav: {
          root: 'Colb Finance',
          context: 'Context',
          process: 'Process',
          motionVideos: 'Motion videos',
          brandSocial: 'Brand & Social',
          onePager: 'One pager',
          gitbook: 'GitBook',
          output: 'Output',
        },
        content: {
          context: (
            <>
              {docLink('https://www.colb.finance/', 'Colb')} is a Swiss-based platform for tokenized pre-IPO investments. I came on as the sole graphic and motion designer, initially to handle social media visuals, which quickly expanded into motion videos, website prototypes, investor materials, and product documentation.
            </>
          ),
          motionVideosP1a:
            'Each video started with a storyboard in Figma before anything touched After Effects.',
          motionVideosP1b:
            'Sound design came before the music track, finding the right effects sometimes took as long as the edit itself. Launch videos are fast and energetic by default. I stayed close to the Colb brand guidelines on type, colour and motion language, but the pacing, the cuts and the sound decisions were mine.',
          motionVideosP2:
            'The CSPX x PancakeSwap video stands out. Instead of a screen recording I rebuilt the swap interface from scratch in After Effects and animated the full transaction flow as a product interaction. Getting the UI details right made the difference between something produced and something that actually communicates how the product works.',
          extraNews:
            'Extra News banners run across three formats: Instagram, Twitter, and LinkedIn. I built a template system in Figma and After Effects so the production is fast, finding the right photo and updating the copy is the actual work. Each format has its own template, each channel gets the right dimensions and layout without rebuilding from scratch every time.',
          editorial:
            'Editorial graphics are different. Each one gets its own visual approach based on what the content is about. The goal is for the image to carry meaning, not just frame the text.',
          onePager:
            'A single-page document covering the full Colb product suite: token structure, underlying assets, and key terms. The challenge was fitting everything without it feeling compressed. Clean layout, clear hierarchy, nothing decorative that doesn’t earn its place.',
          gitbook:
            'Visual system for Colb’s product documentation. Each section needed its own graphic while staying consistent across the whole book. The main challenge was translating technical financial concepts into visuals that actually clarify rather than decorate.',
          gitbookLink: 'docs.colb.finance',
          output:
            '10+ motion launch videos shipped across token listings and partnership integrations. Content reposted by BNB Chain, PancakeSwap, Ethereum, and Concrete official accounts. A consistent visual system across social, editorial, investor materials, and product documentation, built and maintained from scratch as the sole designer on the brand.',
        },
      },
      'sova-labs': {
        description:
          'Spearheaded the end-to-end creative direction, including 2D motion design and high-impact marketing graphics. Developed a comprehensive system of reusable design templates to streamline future content production and ensure long-term brand consistency.',
        skills: ['Creative Direction', '2D Motion Design', 'Design System', 'Marketing Design'],
        nav: {
          context: 'Context',
          process: 'Process',
          motionVideos: 'Motion videos',
          banners: 'Banners',
          output: 'Output',
        },
        content: {
          context: (
            <>
              {docLink('https://sova.io/borrow', 'Sova')} is a DeFi platform with cross-chain swaps, BTC vaults, and onchain liquidity. I came on as graphic and motion designer on a freelance basis, producing social content for their X account across product launches and feature updates.
            </>
          ),
          motionVideos:
            'Each video was built from scratch. The challenge with DeFi content is making something technically accurate without losing the viewer. Cross-chain swaps, vault mechanics, fiat on-ramps, each needed a visual approach that communicated the concept, not just decorated the announcement.',
          banners:
            'Both single banners and series under one post. Some were straightforward announcements, others explained how a specific product works step by step. The visual approach changed depending on whether the goal was to grab attention or actually teach something.',
          output:
            "5 motion videos and 8+ static banners shipped for Sova's X account across product launches, feature updates, and partnership announcements.",
        },
      },
      're-protocol': {
        description: (
          <>
            Partnered with a {threeDLink('3D designer')} to produce high-end explainer and promotional animations for the official X account. Managed the full cycle of video creation to enhance brand presence and community engagement.
          </>
        ),
        skills: ['Creative Direction', 'Motion Design', '3D Animation', 'Video Production'],
        nav: {
          context: 'Context',
          process: 'Process',
          motionVideos: 'Motion videos',
          output: 'Output',
        },
        content: {
          context: (
            <>
              {docLink('https://re.xyz/', 'Re')} is a reinsurance protocol bringing institutional reinsurance capital onchain. I came on as motion designer for a short engagement, collaborating with a 3D artist on a series of announcement videos for their X account.
            </>
          ),
          motionVideos: (
            <>
              The pipeline was split: 3D visuals handled by a {docLink('https://x.com/puselol', 'dedicated artist')}, everything else by me. Text animation, compositing, sound design and final edit. Five videos total covering milestone announcements, protocol launches, and a year-end recap. Working within someone else’s visual output and making it feel cohesive was the main challenge.
            </>
          ),
          output:
            '5 motion videos shipped for Re’s X account across milestone announcements and protocol launches.',
        },
      },
    },
  },
  ru: {
    fullName: 'Глеб Дихтиевский',
    heroRole: 'Графический дизайнер',
    heroText: 'Дизайн для брендов, которые двигаются быстро. Моушн, графика и всё, что между ними.',
    followText: (
      <>
        Следите за мной в {socialLink('https://x.com/glebaagleb', 'X')}, {socialLink('https://t.me/glebaagleb', 'Telegram')}, {socialLink('https://www.behance.net/gleb_diht', 'Behance')} и {socialLink('https://www.linkedin.com/in/gleb-dihtievsky/', 'LinkedIn')}.
      </>
    ),
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
        nav: {
          root: 'Colb Finance',
          context: 'Контекст',
          process: 'Процесс',
          motionVideos: 'Моушн-видео',
          brandSocial: 'Бренд и соцсети',
          onePager: 'Ван-пейджер',
          gitbook: 'GitBook',
          output: 'Результат',
        },
        content: {
          context: (
            <>
              {docLink('https://www.colb.finance/', 'Colb')} это швейцарская платформа для токенизированных pre-IPO инвестиций. Я пришёл туда единственным графическим и моушн-дизайнером, сначала вести визуал для соцсетей, но задача быстро выросла в моушн-видео, прототипы сайта, материалы для инвесторов и продуктовую документацию.
            </>
          ),
          motionVideosP1a:
            'Каждое видео начиналось со сториборда в Figma, до того, как открывался After Effects.',
          motionVideosP1b:
            'Саунд-дизайн шёл раньше музыкального трека: подобрать нужные эффекты иногда занимало столько же времени, сколько сам монтаж. По умолчанию видео к запускам делались быстрыми и энергичными. Я держался брендбука Colb по шрифтам, цвету и языку движения, но темп, монтаж и звуковые решения были моими.',
          motionVideosP2:
            'Отдельно выделяется видео CSPX x PancakeSwap. Вместо записи экрана я с нуля пересобрал интерфейс свопа в After Effects и анимировал весь флоу транзакции как продуктовое взаимодействие. Именно точность деталей интерфейса отделила «просто произведённое» от того, что реально объясняет, как работает продукт.',
          extraNews:
            'Баннеры Extra News выходят в трёх форматах: Instagram, Twitter и LinkedIn. Я собрал шаблонную систему в Figma и After Effects, чтобы производство шло быстро: реальная работа в том, чтобы найти нужное фото и обновить текст. У каждого формата свой шаблон, и каждый канал получает нужные пропорции и раскладку без пересборки с нуля.',
          editorial:
            'С редакционной графикой иначе. У каждой свой визуальный подход в зависимости от темы контента. Цель в том, чтобы изображение несло смысл, а не просто обрамляло текст.',
          onePager:
            'Одностраничный документ, охватывающий всю продуктовую линейку Colb: структуру токена, базовые активы и ключевые условия. Сложность была в том, чтобы уместить всё, не создавая ощущения тесноты. Чистая раскладка, понятная иерархия, ничего декоративного, что не отрабатывает своё место.',
          gitbook:
            'Визуальная система для продуктовой документации Colb. У каждого раздела своя графика при сохранении единства по всей книге. Главный вызов в том, чтобы перевести сложные финансовые концепции в визуал, который проясняет, а не просто украшает.',
          gitbookLink: 'docs.colb.finance',
          output:
            '10+ моушн-видео к запускам, выпущенных для листингов токенов и партнёрских интеграций. Контент репостили официальные аккаунты BNB Chain, PancakeSwap, Ethereum и Concrete. Единая визуальная система для соцсетей, редакционных материалов, инвесторских документов и продуктовой документации, выстроенная и поддерживаемая с нуля единственным дизайнером бренда.',
        },
      },
      'sova-labs': {
        description:
          'Вёл креативное направление от начала и до конца: 2D моушн-дизайн и маркетинговая графика высокого уровня. Разработал систему переиспользуемых шаблонов, чтобы ускорить производство контента и удерживать единство бренда.',
        skills: ['Креативное направление', '2D моушн-дизайн', 'Дизайн-система', 'Маркетинговый дизайн'],
        nav: {
          context: 'Контекст',
          process: 'Процесс',
          motionVideos: 'Моушн-видео',
          banners: 'Баннеры',
          output: 'Результат',
        },
        content: {
          context: (
            <>
              {docLink('https://sova.io/borrow', 'Sova')} это DeFi-платформа с кросс-чейн свопами, BTC-хранилищами и ончейн-ликвидностью. Я пришёл туда графическим и моушн-дизайнером на фрилансе, делал контент для соцсетей их X-аккаунта под запуски продуктов и обновления функций.
            </>
          ),
          motionVideos:
            'Каждое видео собиралось с нуля. Главная сложность с DeFi-контентом в том, чтобы сделать всё технически точным, не потеряв зрителя. Кросс-чейн свопы, механика хранилищ, фиатные ончейн переходы: каждому нужен был визуальный подход, который объяснял суть, а не просто украшал анонс.',
          banners:
            'Были и одиночные баннеры, и серии в одном посте. Часть это простые анонсы, часть объясняла работу конкретного продукта шаг за шагом. Визуальный подход менялся в зависимости от того, нужно ли было привлечь внимание или реально что-то объяснить.',
          output:
            '5 моушн-видео и 8+ статичных баннеров для X-аккаунта Sova: запуски продуктов, обновления функций и партнёрские анонсы.',
        },
      },
      're-protocol': {
        description: (
          <>
            В паре с {threeDLink('3D-дизайнером')} создавали высококачественные объяснительные и промо-анимации для официального X-аккаунта. Вёл полный цикл производства видео, чтобы усилить присутствие бренда и вовлечённость сообщества.
          </>
        ),
        skills: ['Креативное направление', 'Моушн-дизайн', '3D-анимация', 'Видеопродакшн'],
        nav: {
          context: 'Контекст',
          process: 'Процесс',
          motionVideos: 'Моушн-видео',
          output: 'Результат',
        },
        content: {
          context: (
            <>
              {docLink('https://re.xyz/', 'Re')} это протокол перестрахования, который переносит институциональный перестраховочный капитал ончейн. Я пришёл туда моушн-дизайнером на короткий проект, работая в паре с 3D-художником над серией анонсных видео для их X-аккаунта.
            </>
          ),
          motionVideos: (
            <>
              Пайплайн был разделён: 3D-визуал делал {docLink('https://x.com/puselol', 'выделенный 3D-художник')}, всё остальное делал я. Анимация текста, композитинг, саунд-дизайн и финальный монтаж. Всего пять видео: анонсы вех, запуски протокола и итоговый ролик года. Главный вызов был в том, чтобы работать поверх чужого визуала и сделать всё цельным.
            </>
          ),
          output:
            '5 моушн-видео для X-аккаунта Re: анонсы вех и запуски протокола.',
        },
      },
    },
  },
}

export const LANGS = [
  { code: 'en', label: 'En' },
  { code: 'ru', label: 'Ru' },
]

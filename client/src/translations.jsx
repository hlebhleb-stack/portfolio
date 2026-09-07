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
          'X content design for a Swiss fintech project. Built a consistent visual language out of motion graphics, infographics, and announcement assets – translating dense financial mechanics into clear, focused posts.',
        skills: ['UX/UI', 'Web Prototyping', 'Brand Identity', 'Motion Design'],
        nav: {
          root: 'Colb Finance',
          context: 'Context',
          role: 'Role',
          process: 'Process',
          motionVideos: 'Motion videos',
          brandSocial: 'Brand & Social',
          onePager: 'One pager',
          gitbook: 'GitBook',
          brandKit: 'Brand kit',
          output: 'Output',
        },
        content: {
          context: (
            <>
              {docLink('https://www.colb.finance/', 'Colb')} is a Swiss-based platform for tokenized pre-IPO investments. I came on as a graphic and motion designer, initially to handle social media visuals, which quickly expanded into motion videos, website prototypes, investor materials, and product documentation.
            </>
          ),
          role: 'Graphic & Motion Designer, Sep 2025 to Present',
          motionVideosP1a:
            'Each video started with a storyboard in Figma before anything touched After Effects.',
          motionVideosP1b: (
            <>
              Sound design came before the music track, finding the right effects sometimes took as long as the edit itself. Launch videos are fast and energetic by default. I stayed close to the Colb brand guidelines on type, colour and motion language, but the pacing, the cuts and the sound decisions were mine. The rest of the motion videos are on {docLink('https://x.com/ColbFinance', 'Colb')}’s X.
            </>
          ),
          motionVideosP2:
            'The CSPX x PancakeSwap video stands out. Instead of a screen recording I rebuilt the swap interface from scratch in After Effects and animated the full transaction flow as a product interaction. Getting the UI details right made the difference between something produced and something that actually communicates how the product works.',
          extraNews:
            'Extra News banners run across three formats: Instagram, X, and LinkedIn. I built a template system in Figma and After Effects so the production is fast, finding the right photo and updating the copy is the actual work. Each format has its own template, each channel gets the right dimensions and layout without rebuilding from scratch every time.',
          editorial:
            'Editorial graphics are different. Each one gets its own visual approach based on what the content is about. The goal is for the image to carry meaning, not just frame the text.',
          onePager:
            'A single-page document covering the full Colb product suite: token structure, underlying assets, and key terms. The challenge was fitting everything without it feeling compressed. Clean layout, clear hierarchy, nothing decorative that doesn’t earn its place.',
          gitbook:
            'Visual system for Colb’s product documentation. Each section needed its own graphic while staying consistent across the whole book. The main challenge was translating technical financial concepts into visuals that actually clarify rather than decorate.',
          gitbookLink: 'docs.colb.finance',
          brandKit:
            "A Notion-based brand kit built for partners and contractors who need quick access to Colb's visual identity. Covers logos, typography, and core colours in one structured page. The goal was to make it easy to share and self-serve without needing to contact the design team for every basic asset.",
          brandKitLink: 'colb.notion.site/Brandkit',
          output:
            '10+ motion launch videos shipped across token listings and partnership integrations. Content reposted by BNB Chain, PancakeSwap, Ethereum, and Concrete official accounts. A consistent visual system across social, editorial, investor materials, and product documentation, built and maintained from scratch.',
        },
      },
      'sova-labs': {
        description:
          'Spearheaded the end-to-end creative direction, including 2D motion design and high-impact marketing graphics. Developed a comprehensive system of reusable design templates to streamline future content production and ensure long-term brand consistency.',
        skills: ['Creative Direction', '2D Motion Design', 'Design System', 'Marketing Design'],
        nav: {
          context: 'Context',
          role: 'Role',
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
          role: 'Social Media Designer, Jan 2026 to May 2026',
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
          role: 'Role',
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
          role: 'Motion Designer, Dec 2025 to Mar 2026',
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
          'Дизайн контента для X швейцарского финтех-проекта. Собрал единый визуальный язык из моушн-графики, инфографики и анонсов, который переводит сложную финансовую механику в понятные посты.',
        skills: ['UX/UI', 'Веб-прототипирование', 'Айдентика', 'Моушн-дизайн'],
        nav: {
          root: 'Colb Finance',
          context: 'Контекст',
          role: 'Роль',
          process: 'Процесс',
          motionVideos: 'Моушн-видео',
          brandSocial: 'Бренд и соцсети',
          onePager: 'One-pager',
          gitbook: 'GitBook',
          brandKit: 'Бренд-кит',
          output: 'Результат',
        },
        content: {
          context: (
            <>
              {docLink('https://www.colb.finance/', 'Colb')} это швейцарская платформа для токенизированных pre-IPO инвестиций. Я пришёл туда графическим и моушн-дизайнером: начинал с визуала для соцсетей, но задача быстро выросла в моушн-видео, прототипы сайта, материалы для инвесторов и продуктовую документацию.
            </>
          ),
          role: 'Графический и моушн-дизайнер, с сентября 2025 по настоящее время',
          motionVideosP1a:
            'Каждое видео начиналось со сториборда в Figma, ещё до After Effects.',
          motionVideosP1b: (
            <>
              Саунд-дизайн шёл раньше музыкального трека: подобрать нужные эффекты иногда занимало не меньше времени, чем сам монтаж. Видео к запускам всегда быстрые и энергичные. Я держался брендбука Colb по шрифтам, цвету и языку движения, но темп, монтаж и звук были моим решением. Остальные моушн-видео можно посмотреть в X у {docLink('https://x.com/ColbFinance', 'Colb')}.
            </>
          ),
          motionVideosP2:
            'Отдельно стоит видео CSPX x PancakeSwap. Вместо записи экрана я с нуля пересобрал интерфейс свопа в After Effects и анимировал весь флоу транзакции как реальное взаимодействие с продуктом. Именно точность в деталях интерфейса отличает ролик, который просто снят, от того, который реально объясняет, как работает продукт.',
          extraNews:
            'Баннеры Extra News выходят в трёх форматах: Instagram, X и LinkedIn. Я собрал шаблонную систему в Figma и After Effects, чтобы производство шло быстро: реальная работа в том, чтобы найти нужное фото и обновить текст. У каждого формата свой шаблон, и каждый канал получает нужные пропорции и раскладку без пересборки с нуля.',
          editorial:
            'С редакционной графикой иначе. У каждой свой визуальный подход в зависимости от темы контента. Цель в том, чтобы изображение несло смысл, а не просто обрамляло текст.',
          onePager:
            'Одностраничный документ, охватывающий всю продуктовую линейку Colb: структуру токена, базовые активы и ключевые условия. Сложность была в том, чтобы уместить всё, не создавая ощущения тесноты. Чистая раскладка, понятная иерархия и никакой декоративности ради декоративности.',
          gitbook:
            'Визуальная система для продуктовой документации Colb. У каждого раздела своя графика, но вся книга держится в едином стиле. Главный вызов в том, чтобы перевести сложные финансовые концепции в визуал, который проясняет, а не просто украшает.',
          gitbookLink: 'docs.colb.finance',
          brandKit:
            'Бренд-кит на Notion для партнёров и подрядчиков, которым нужен быстрый доступ к визуальной айдентике Colb. Логотипы, типографика и основные цвета собраны на одной странице. Идея в том, чтобы можно было взять всё самому, не дёргая дизайн-команду по каждому мелкому активу.',
          brandKitLink: 'colb.notion.site/Brandkit',
          output:
            '10+ моушн-видео к запускам, выпущенных для листингов токенов и партнёрских интеграций. Контент репостили официальные аккаунты BNB Chain, PancakeSwap, Ethereum и Concrete. Единая визуальная система для соцсетей, редакционных материалов, инвесторских документов и продуктовой документации, построенная и поддерживаемая с нуля.',
        },
      },
      'sova-labs': {
        description:
          'Вёл креативное направление от начала и до конца: 2D моушн-дизайн и эффектная маркетинговая графика. Разработал систему переиспользуемых шаблонов, чтобы ускорить производство контента и сохранять единство бренда.',
        skills: ['Креативное направление', '2D моушн-дизайн', 'Дизайн-система', 'Маркетинговый дизайн'],
        nav: {
          context: 'Контекст',
          role: 'Роль',
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
          role: 'SMM-дизайнер, с января по май 2026',
          motionVideos:
            'Каждое видео собиралось с нуля. Главная сложность DeFi-контента в том, чтобы всё было технически точным и при этом не терять зрителя. Кросс-чейн свопы, механика хранилищ, фиатные ончейн-переходы: под каждый нужен был свой визуальный подход, который объясняет суть, а не просто украшает анонс.',
          banners:
            'Были и одиночные баннеры, и серии в одном посте. Часть это простые анонсы, часть объясняла работу конкретного продукта шаг за шагом. Визуальный подход менялся в зависимости от того, нужно ли было привлечь внимание или реально что-то объяснить.',
          output:
            '5 моушн-видео и 8+ статичных баннеров для X-аккаунта Sova: запуски продуктов, обновления функций и партнёрские анонсы.',
        },
      },
      're-protocol': {
        description: (
          <>
            В паре с {threeDLink('3D-дизайнером')} делали объясняющие и промо-анимации для официального X-аккаунта. Вёл весь цикл производства видео: от идеи до финального монтажа.
          </>
        ),
        skills: ['Креативное направление', 'Моушн-дизайн', '3D-анимация', 'Видеопродакшн'],
        nav: {
          context: 'Контекст',
          role: 'Роль',
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
          role: 'Моушн-дизайнер, с декабря 2025 по март 2026',
          motionVideos: (
            <>
              Пайплайн был разделён: 3D-визуал делал {docLink('https://x.com/puselol', 'отдельный художник')}, всё остальное делал я: анимация текста, композитинг, саунд-дизайн и финальный монтаж. Всего пять видео: анонсы вех, запуски протокола и итоговый ролик года. Главной сложностью было работать поверх чужого визуала и сделать всё цельным.
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

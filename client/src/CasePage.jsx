import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useFadeIn from './useFadeIn.js'
import HeaderMenu from './HeaderMenu.jsx'
import { translations, LANGS } from './translations.jsx'

function VideoItem({ src, alt }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label={alt}
      onLoadedData={(e) => e.target.parentElement.classList.add('loaded')}
      onLoadedMetadata={(e) => e.target.parentElement.classList.add('loaded')}
    />
  )
}

const API_URL = import.meta.env.VITE_API_URL || ''

const casesData = {
  'colb-finance': {
    company: 'Colb.finance',
    url: 'https://x.com/ColbFinance',
    items: [
      { type: 'image', src: '/assets/works/colb-finance/1.png' },
      { type: 'image', src: '/assets/works/colb-finance/2.png' },
      { type: 'video', src: '/assets/works/colb-finance/3.mp4' },
      { type: 'video', src: '/assets/works/colb-finance/4.mp4' },
      { type: 'video', src: '/assets/works/colb-finance/5.mp4' },
      { type: 'video', src: '/assets/works/colb-finance/6.mp4' },
      { type: 'video', src: '/assets/works/colb-finance/7.mp4' },
      { type: 'video', src: '/assets/works/colb-finance/8.mp4' },
      { type: 'video', src: '/assets/works/colb-finance/9.mp4' },
      { type: 'image', src: '/assets/works/colb-finance/9.png' },
    ],
  },
  'sova-labs': {
    company: 'Sova Labs',
    url: 'https://x.com/SovaBTC',
    items: [
      { type: 'video', src: '/assets/works/sova-labs/1.mp4' },
      { type: 'video', src: '/assets/works/sova-labs/2.mp4' },
      { type: 'image', src: '/assets/works/sova-labs/2.png' },
      { type: 'video', src: '/assets/works/sova-labs/3.mp4' },
      { type: 'video', src: '/assets/works/sova-labs/4.mp4' },
      { type: 'image', src: '/assets/works/sova-labs/4.png' },
      { type: 'video', src: '/assets/works/sova-labs/5.mp4' },
      { type: 'image', src: '/assets/works/sova-labs/6.png' },
    ],
  },
  're-protocol': {
    company: 'Re Protocol',
    url: 'https://x.com/re',
    items: [
      { type: 'video', src: '/assets/works/re-protocol/1.mp4' },
      { type: 'video', src: '/assets/works/re-protocol/2.mp4' },
      { type: 'video', src: '/assets/works/re-protocol/3.mp4' },
      { type: 'video', src: '/assets/works/re-protocol/4.mp4' },
      { type: 'video', src: '/assets/works/re-protocol/5.mp4' },
    ],
  },
}

const slugs = Object.keys(casesData)

function CasePage({ theme, setTheme, lang, setLang }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const caseData = casesData[slug]
  const t = translations[lang]
  const caseTranslation = caseData ? t.cases[slug] : null
  const pageRef = useFadeIn()
  const [filter, setFilter] = useState('all')
  const [lastSlug, setLastSlug] = useState(slug)
  if (slug !== lastSlug) {
    setLastSlug(slug)
    setFilter('all')
  }
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const touchStartScale = useRef(1)
  const touchCancelled = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${API_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: `/case/${slug}`,
        referrer: document.referrer,
        screenWidth: window.innerWidth,
      }),
    }).catch(() => {})
  }, [slug])

  useEffect(() => {
    const getScale = () =>
      (window.visualViewport && window.visualViewport.scale) || 1
    const onTouchStart = (e) => {
      if (e.touches.length > 1 || getScale() > 1.01) {
        touchCancelled.current = true
        return
      }
      touchCancelled.current = false
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      touchStartTime.current = Date.now()
      touchStartScale.current = getScale()
    }
    const onTouchMove = (e) => {
      if (e.touches.length > 1 || getScale() > 1.01) {
        touchCancelled.current = true
      }
    }
    const onGestureStart = () => {
      touchCancelled.current = true
    }
    const onTouchEnd = (e) => {
      if (touchCancelled.current) return
      if (getScale() > 1.01) return
      if (Math.abs(getScale() - touchStartScale.current) > 0.01) return
      const duration = Date.now() - touchStartTime.current
      if (duration > 500) return
      const dx = e.changedTouches[0].clientX - touchStartX.current
      const dy = e.changedTouches[0].clientY - touchStartY.current
      if (Math.abs(dx) < 80) return
      if (Math.abs(dy) > Math.abs(dx) * 0.5) return
      const currentIndex = slugs.indexOf(slug)
      if (dx > 0) {
        if (currentIndex === 0) {
          navigate('/')
        } else {
          navigate(`/case/${slugs[currentIndex - 1]}`)
        }
      } else {
        if (currentIndex < slugs.length - 1) {
          navigate(`/case/${slugs[currentIndex + 1]}`)
        } else {
          navigate('/')
        }
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('gesturestart', onGestureStart, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('gesturestart', onGestureStart)
    }
  }, [slug, navigate])

  if (!caseData) {
    return (
      <div className="page">
        <div className="case-not-found">
          <p>{t.notFound}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page" ref={pageRef}>
      {/* Header */}
      <header className="header">
        <div className="lang-toggle">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`lang-btn${lang === l.code ? ' active' : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <HeaderMenu theme={theme} setTheme={setTheme} lang={lang} />
      </header>

      {/* Case Hero */}
      <section className="case-hero">
        <a
          href={caseData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="case-link"
        >
          {caseData.company}
          <span className="case-link-arrow" aria-hidden="true">↗</span>
        </a>
        {caseTranslation?.description && (
          <p className="case-description">{caseTranslation.description}</p>
        )}
        {caseTranslation?.skills && caseTranslation.skills.length > 0 && (
          <ul className="case-skills">
            {caseTranslation.skills.map((skill) => (
              <li key={skill} className="case-skill">{skill}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Filter */}
      {(() => {
        const videoCount = caseData.items.filter((it) => it.type === 'video').length
        const imageCount = caseData.items.length - videoCount
        if (videoCount === 0 || imageCount === 0) return null
        return (
          <div className="case-filter">
            <button
              className={`case-filter-btn${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
              type="button"
            >
              {t.filter.all}
            </button>
            <button
              className={`case-filter-btn${filter === 'video' ? ' active' : ''}`}
              onClick={() => setFilter('video')}
              type="button"
            >
              {t.filter.videos}
            </button>
            <button
              className={`case-filter-btn${filter === 'image' ? ' active' : ''}`}
              onClick={() => setFilter('image')}
              type="button"
            >
              {t.filter.banners}
            </button>
          </div>
        )
      })()}

      {/* Gallery */}
      <div className="case-gallery">
        {caseData.items
          .filter((item) => filter === 'all' || item.type === filter)
          .map((item, i) => (
            <div key={`${filter}-${item.src}`} className="case-gallery-item">
              {item.type === 'video' ? (
                <VideoItem src={item.src} alt={`${caseData.company} work ${i + 1}`} />
              ) : (
                <img
                  src={item.src}
                  alt={`${caseData.company} work ${i + 1}`}
                  loading="lazy"
                  onLoad={(e) => e.target.parentElement.classList.add('loaded')}
                />
              )}
            </div>
          ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-main">
          <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" className="footer-cv">{t.cv}</a>
          <a href="mailto:glebaaagleb@gmail.com" className="footer-email">
            glebaaagleb@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}

export default CasePage

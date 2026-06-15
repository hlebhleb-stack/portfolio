import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useFadeIn from './useFadeIn.js'
import { translations, LANGS } from './translations.jsx'
import generatedItems from './caseItems.generated.json'
import columnOverrides from './caseItemsColumns.js'
import mediaLinks from './mediaLinks.js'

function VideoItem({ src, alt }) {
  const videoRef = useRef(null)
  const sentinelRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [hasMounted, setHasMounted] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const parent = sentinelRef.current?.parentElement
    if (!parent) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current
        if (entry.isIntersecting) {
          setHasMounted(true)
          if (v && v.paused) {
            const p = v.play()
            if (p && typeof p.catch === 'function') p.catch(() => {})
          }
        } else if (v) {
          v.pause()
        }
      },
      { rootMargin: '800px 0px' }
    )
    io.observe(parent)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onOtherUnmuted = (e) => {
      const v = videoRef.current
      if (!v) return
      if (e.detail?.source === v) return
      if (!v.muted) {
        v.muted = true
        setMuted(true)
      }
    }
    window.addEventListener('video-unmuted', onOtherUnmuted)
    return () => window.removeEventListener('video-unmuted', onOtherUnmuted)
  }, [])

  const toggleMute = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    const next = !v.muted
    v.muted = next
    if (!next) {
      v.volume = 1
      window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { source: v } }))
    }
    setMuted(next)
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }

  return (
    <>
      <span ref={sentinelRef} style={{ display: 'none' }} aria-hidden="true" />
      {hasMounted && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          onLoadedData={(e) => e.target.parentElement.classList.add('loaded')}
          onLoadedMetadata={(e) => e.target.parentElement.classList.add('loaded')}
          onClick={toggleMute}
        />
      )}
      <button
        type="button"
        className="video-mute-btn"
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        onClick={toggleMute}
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#fff" stroke="#fff" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#fff" stroke="#fff" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  )
}

function MediaLinkOverlay({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="video-link-btn"
      aria-label="Open related post"
      onClick={(e) => e.stopPropagation()}
    >
      <svg width="18" height="18" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" strokeWidth="10.6667" strokeLinecap="round" strokeLinejoin="round">
        <path d="M53.332 69.3338C55.6224 72.3958 58.5446 74.9294 61.9003 76.7628C65.256 78.5962 68.9667 79.6864 72.7808 79.9596C76.5949 80.2327 80.4232 79.6824 84.0059 78.346C87.5886 77.0095 90.842 74.9182 93.5454 72.2138L109.545 56.2138C114.403 51.1844 117.091 44.4483 117.03 37.4564C116.969 30.4645 114.165 23.7762 109.221 18.832C104.276 13.8878 97.588 11.0833 90.5961 11.0225C83.6041 10.9617 76.8681 13.6496 71.8387 18.5071L62.6654 27.6271" />
        <path d="M74.656 58.6627C72.3656 55.6006 69.4434 53.067 66.0877 51.2336C62.732 49.4003 59.0213 48.31 55.2072 48.0369C51.3931 47.7637 47.5649 48.314 43.9822 49.6505C40.3995 50.9869 37.1461 53.0783 34.4427 55.7827L18.4427 71.7827C13.5851 76.8121 10.8973 83.5481 10.958 90.54C11.0188 97.5319 13.8233 104.22 18.7675 109.164C23.7117 114.109 30.4001 116.913 37.392 116.974C44.3839 117.035 51.1199 114.347 56.1493 109.489L65.2693 100.369" />
      </svg>
    </a>
  )
}

const API_URL = import.meta.env.VITE_API_URL || ''

const caseMeta = {
  'colb-finance': { company: 'Colb.finance', url: 'https://x.com/ColbFinance' },
  'sova-labs':    { company: 'Sova Labs',    url: 'https://x.com/SovaBTC' },
  're-protocol':  { company: 'Re Protocol',  url: 'https://x.com/re' },
}

const casesData = Object.fromEntries(
  Object.entries(caseMeta).map(([slug, meta]) => [
    slug,
    { ...meta, items: generatedItems[slug] || [] },
  ])
)

function CasePage({ theme, setTheme, lang, setLang }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const caseData = casesData[slug]
  const t = translations[lang]
  const caseTranslation = caseData ? t.cases[slug] : null
  const [filter, setFilter] = useState('all')
  const pageRef = useFadeIn([slug, filter])
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

  const langRef = useRef(lang)
  useEffect(() => { langRef.current = lang }, [lang])
  useEffect(() => {
    let sid = ''
    try {
      sid = sessionStorage.getItem('sid') || ''
      if (!sid) {
        sid = (crypto.randomUUID && crypto.randomUUID()) ||
          Math.random().toString(36).slice(2) + Date.now().toString(36)
        sessionStorage.setItem('sid', sid)
      }
    } catch { /* ignore */ }
    fetch(`${API_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: `/case/${slug}`,
        screenWidth: window.innerWidth,
        lang: langRef.current,
        sessionId: sid,
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
      // Ignore touches that start within ~30px of either side of
      // the screen — those belong to Safari's native edge-swipe-back
      // gesture. Letting our handler fire on the same gesture used to
      // pop one extra history entry, sending the user back to whatever
      // site they had open before the portfolio.
      const x = e.touches[0].clientX
      if (x < 30 || x > window.innerWidth - 30) {
        touchCancelled.current = true
        return
      }
      touchCancelled.current = false
      touchStartX.current = x
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
      const target = (location.key && location.key !== 'default') ? -1 : '/'
      const gallery = document.querySelector('.case-gallery')
      if (gallery) gallery.style.visibility = 'hidden'
      document.querySelectorAll('video').forEach((v) => {
        try {
          v.pause()
          v.removeAttribute('src')
          v.load()
        } catch { /* ignore */ }
      })
      requestAnimationFrame(() => navigate(target))
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
  }, [slug, navigate, location.key])

  if (!caseData) {
    return (
      <div className="page">
        <div className="case-not-found">
          <h2>{t.notFound}</h2>
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
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? (
            <svg className="theme-icon theme-icon-sun" width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 0.75H6.7575M12.75 6.75H12.7575M6.75 12.75H6.7575M0.75 6.75H0.7575M10.9927 2.50725H11.0002M10.9927 10.9927H11.0002M2.50725 10.9927H2.51475M2.50725 2.50725H2.51475M9.75 6.75C9.75 8.40685 8.40685 9.75 6.75 9.75C5.09315 9.75 3.75 8.40685 3.75 6.75C3.75 5.09315 5.09315 3.75 6.75 3.75C8.40685 3.75 9.75 5.09315 9.75 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="theme-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.4896 6.93267C12.4284 8.06581 12.0404 9.15697 11.3723 10.0743C10.7042 10.9915 9.78471 11.6957 8.72499 12.1016C7.66527 12.5074 6.51066 12.5976 5.40076 12.3613C4.29085 12.125 3.27316 11.5722 2.4707 10.7699C1.66824 9.96748 1.11537 8.94984 0.878925 7.83996C0.64248 6.73008 0.732581 5.57547 1.13834 4.5157C1.54409 3.45593 2.24813 2.53638 3.16535 1.8682C4.08256 1.20003 5.17369 0.811829 6.30682 0.750539C6.57115 0.736181 6.70952 1.05077 6.56919 1.27464C6.09985 2.02557 5.89888 2.91342 5.99908 3.79328C6.09928 4.67313 6.49474 5.49305 7.12091 6.11923C7.74709 6.74541 8.56701 7.14086 9.44687 7.24106C10.3267 7.34127 11.2146 7.14029 11.9655 6.67095C12.19 6.53063 12.504 6.66834 12.4896 6.93267Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </header>

      {/* Case Hero */}
      <section className="case-hero">
        <h1 className="case-title"><a href={caseData.url} target="_blank" rel="noopener noreferrer">{caseData.company}<span className="hero-dot">.</span></a></h1>
        {caseTranslation?.description && (
          <p className="case-description">{caseTranslation.description}</p>
        )}
        {caseTranslation?.skills && caseTranslation.skills.length > 0 && (
          <ul className="case-skills">
            {Array.from({ length: Math.ceil(caseTranslation.skills.length / 2) }, (_, ri) => (
              <li key={ri} className="case-skills-row">
                {caseTranslation.skills.slice(ri * 2, ri * 2 + 2).map((skill) => (
                  <span key={skill} className="case-skill">{skill}</span>
                ))}
              </li>
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

      {/* Gallery — two-column masonry. For each item:
            – if its src is listed in caseItemsColumns.js, force that
              column (1 = left, 2 = right);
            – otherwise place it in whichever column currently has
              fewer items so far.
          CSS `order` preserves source order both within each column
          (where they happen to render in render order anyway) and
          when the layout collapses to one column on narrow phones. */}
      {(() => {
        const visibleItems = caseData.items.filter(
          (item) => filter === 'all' || item.type === filter
        )
        const renderItem = (item, originalIndex) => {
          const linkUrl = mediaLinks[item.src]
          return (
            <div
              key={`${filter}-${item.src}`}
              className="case-gallery-item"
              style={{ order: originalIndex }}
            >
              {item.type === 'video' ? (
                <VideoItem src={item.src} alt={`${caseData.company} work ${originalIndex + 1}`} />
              ) : (
                <img
                  src={item.src}
                  alt={`${caseData.company} work ${originalIndex + 1}`}
                  decoding="async"
                  fetchPriority="high"
                  onLoad={(e) => e.target.parentElement.classList.add('loaded')}
                />
              )}
              {linkUrl && <MediaLinkOverlay href={linkUrl} />}
            </div>
          )
        }
        const col1 = []
        const col2 = []
        visibleItems.forEach((item, index) => {
          const override = columnOverrides[item.src]
          let targetCol
          if (override === 1) targetCol = 0
          else if (override === 2) targetCol = 1
          else targetCol = col1.length <= col2.length ? 0 : 1
          if (targetCol === 0) col1.push({ item, index })
          else col2.push({ item, index })
        })
        return (
          <div className="case-gallery">
            <div className="case-gallery-col">
              {col1.map(({ item, index }) => renderItem(item, index))}
            </div>
            <div className="case-gallery-col">
              {col2.map(({ item, index }) => renderItem(item, index))}
            </div>
          </div>
        )
      })()}

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

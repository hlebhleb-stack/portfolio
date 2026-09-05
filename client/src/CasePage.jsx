import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useFadeIn from './useFadeIn.js'
import { translations, LANGS } from './translations.jsx'
import generatedItems from './caseItems.generated.json'
import columnOverrides from './caseItemsColumns.js'
import mediaLinks from './mediaLinks.js'
import MusicPlayer from './MusicPlayer.jsx'

function VideoItem({ src, alt, priority = false }) {
  const videoRef = useRef(null)
  const sentinelRef = useRef(null)
  const [muted, setMuted] = useState(true)
  // Priority videos mount immediately so they start downloading on the
  // first paint instead of waiting for the IntersectionObserver tick.
  const [hasMounted, setHasMounted] = useState(priority || typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    // Priority videos opt out of the observer — they are always mounted
    // and the browser handles pause/play via the autoplay/visibility
    // policy on its own.
    if (priority) return
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
  }, [priority])

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
    // Picking a track from the music menu always wins over a currently
    // audible video — MusicPlayer dispatches this to hand control back.
    const onSilenceVideos = () => {
      const v = videoRef.current
      if (!v) return
      if (!v.muted) {
        v.muted = true
        setMuted(true)
      }
    }
    window.addEventListener('video-unmuted', onOtherUnmuted)
    window.addEventListener('silence-videos', onSilenceVideos)
    return () => {
      window.removeEventListener('video-unmuted', onOtherUnmuted)
      window.removeEventListener('silence-videos', onSilenceVideos)
    }
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
    } else {
      // Resuming music needs an actual user gesture (Safari won't allow a
      // programmatic play() otherwise) — dispatched synchronously here,
      // inside the click handler, rather than relying on the native
      // 'volumechange' event, which fires via a queued media task and can
      // arrive too late to still count as gesture-triggered.
      window.dispatchEvent(new CustomEvent('video-muted'))
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
          preload={priority ? "auto" : "metadata"}
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

const COLB_MOTION_MAIN = '/assets/works/colb-finance/1.mp4'
// Numbers are the source files, which keep their original numbering even
// after some were dropped from the case — the gaps are intentional.
const COLB_MOTION_REST = [2, 3, 4, 5, 7, 8, 10, 12].map(
  (n) => `/assets/works/colb-finance/${n}.mp4`
)
const COLB_BANNERS = Array.from({ length: 5 }, (_, i) => `/assets/works/colb-finance/${i + 1}.png`)
const COLB_STORYBOARD = '/assets/works/colb-finance/storyboard-sequence.png'
const COLB_EXTRA_NEWS = '/assets/works/colb-finance/extra-news-template.png'
const COLB_ONE_PAGER = '/assets/works/colb-finance/one-pager-document.png'
const COLB_GITBOOK = '/assets/works/colb-finance/gitbook-visuals.png'

const RE_VIDEOS = Array.from({ length: 5 }, (_, i) => `/assets/works/re-protocol/${i + 1}.mp4`)

const SOVA_VIDEOS = Array.from({ length: 5 }, (_, i) => `/assets/works/sova-labs/${i + 1}.mp4`)
const SOVA_BANNERS = Array.from({ length: 3 }, (_, i) => `/assets/works/sova-labs/${i + 1}.png`)

const DOC_CASE_SLUGS = ['colb-finance', 're-protocol', 'sova-labs']

// Matches the folder order on the home page's works section — left/right
// case nav follows the same sequence, and runs off either end into that
// section rather than wrapping around.
const CASE_ORDER = ['colb-finance', 'sova-labs', 're-protocol']

function ColbMediaItem({ item, priority, order }) {
  const linkUrl = mediaLinks[item.src]
  return (
    <div className="colb-media-item" style={{ order }}>
      {item.type === 'video' ? (
        <VideoItem src={item.src} alt={item.alt} priority={priority} />
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          decoding="async"
          loading="lazy"
          onLoad={(e) => e.target.parentElement.classList.add('loaded')}
        />
      )}
      {linkUrl && <MediaLinkOverlay href={linkUrl} />}
    </div>
  )
}

function ColbMedia({ items }) {
  if (items.length === 0) return null
  if (items.length === 1) {
    return (
      <div className="colb-media-grid single">
        <ColbMediaItem item={items[0]} priority order={0} />
      </div>
    )
  }
  // Two-column masonry: items go into whichever column currently has
  // less accumulated height, using aspect ratio as a stand-in since real
  // heights aren't known until media loads. Falls back to a manual
  // override in caseItemsColumns.js for items with unusual ratios.
  const col1 = []
  const col2 = []
  let h1 = 0
  let h2 = 0
  items.forEach((item, index) => {
    const override = columnOverrides[item.src]
    const ratio = item.ratio || 1
    let targetCol
    if (override === 1) targetCol = 0
    else if (override === 2) targetCol = 1
    else targetCol = h1 <= h2 ? 0 : 1
    if (targetCol === 0) {
      col1.push({ item, index })
      h1 += ratio
    } else {
      col2.push({ item, index })
      h2 += ratio
    }
  })
  return (
    <div className="colb-media-grid">
      <div className="colb-media-col">
        {col1.map(({ item, index }) => (
          <ColbMediaItem key={item.src} item={item} priority={index === 0} order={index} />
        ))}
      </div>
      <div className="colb-media-col">
        {col2.map(({ item, index }) => (
          <ColbMediaItem key={item.src} item={item} priority={index === 0} order={index} />
        ))}
      </div>
    </div>
  )
}

function ColbLabel({ children, className = '' }) {
  return (
    <p className={`colb-section-label${className ? ` ${className}` : ''}`}>
      <img src="/assets/dot.svg" alt="" className="colb-label-dot" aria-hidden="true" />
      {children}
    </p>
  )
}

function ColbNavButton({ id, label, activeId, onNavigate }) {
  return (
    <button
      type="button"
      className={activeId === id ? 'active' : ''}
      onClick={() => onNavigate(id)}
    >
      {label}
    </button>
  )
}

function ColbSidebar({ navItems, activeId, onNavigate }) {
  return (
    <nav className="colb-sidebar">
      <ul className="colb-sidebar-list">
        {navItems.map((entry, i) =>
          entry.children ? (
            <li key={i} className="colb-sidebar-item">
              <span className="colb-sidebar-group">{entry.label}</span>
              <ul className="colb-sidebar-sublist">
                {entry.children.map((child) => (
                  <li key={child.id} className="colb-sidebar-item">
                    <ColbNavButton id={child.id} label={child.label} activeId={activeId} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={entry.id} className="colb-sidebar-item">
              <ColbNavButton id={entry.id} label={entry.label} activeId={activeId} onNavigate={onNavigate} />
            </li>
          )
        )}
      </ul>
    </nav>
  )
}

function ColbCaseBody({ sectionIds, navItems, children, footer }) {
  const contentRef = useRef(null)
  const spacerRef = useRef(null)
  const pickedRef = useRef(null)
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (sections.length === 0) return
    // The final section never needs to reach the top of the viewport: clicking it
    // just scrolls to the bottom, and the `atBottom` branch below highlights it.
    // Only the one before it has to be reachable, which needs far less room.
    const target = sections[sections.length - 2]
    if (!target) return
    const SCROLL_MARGIN = 140
    const updateSpacer = () => {
      if (!spacerRef.current) return
      spacerRef.current.style.height = '0px'
      const targetTop = target.getBoundingClientRect().top + window.scrollY
      const shortfall = targetTop - SCROLL_MARGIN + window.innerHeight - document.documentElement.scrollHeight
      spacerRef.current.style.height = `${Math.max(0, shortfall)}px`
    }
    updateSpacer()
    window.addEventListener('resize', updateSpacer)
    return () => window.removeEventListener('resize', updateSpacer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (sections.length === 0) return
    const OFFSET = 160
    let ticking = false
    const update = () => {
      ticking = false
      // A section picked from the sidebar stays lit until the reader scrolls
      // themselves: the last two sections share the same bottom scroll position,
      // so position alone can't tell which one was asked for.
      if (pickedRef.current) {
        setActiveId(pickedRef.current)
        return
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActiveId(sections[sections.length - 1].id)
        return
      }
      let current = sections[0].id
      for (const s of sections) {
        if (s.getBoundingClientRect().top - OFFSET <= 0) current = s.id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    const releasePick = () => {
      if (!pickedRef.current) return
      pickedRef.current = null
      onScroll()
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', releasePick, { passive: true })
    window.addEventListener('touchstart', releasePick, { passive: true })
    window.addEventListener('keydown', releasePick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', releasePick)
      window.removeEventListener('touchstart', releasePick)
      window.removeEventListener('keydown', releasePick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')])

  const handleNavigate = (id) => {
    pickedRef.current = id
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="colb-layout" ref={contentRef}>
      <ColbSidebar navItems={navItems} activeId={activeId} onNavigate={handleNavigate} />
      <div className="colb-content">
        {children}
        {footer}
        <div ref={spacerRef} aria-hidden="true" />
      </div>
    </div>
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

  const caseNav = (
    <div className="case-nav">
      <button
        type="button"
        className="case-nav-arrow case-nav-arrow-left"
        aria-label="Previous case"
        onClick={() => {
          const i = CASE_ORDER.indexOf(slug)
          if (i > 0) navigate(`/case/${CASE_ORDER[i - 1]}`)
          else navigate('/', { state: { scrollToWorks: true } })
        }}
      >
        <img src="/assets/left.svg" alt="" draggable="false" />
      </button>
      <button
        type="button"
        className="case-nav-arrow case-nav-arrow-right"
        aria-label="Next case"
        onClick={() => {
          const i = CASE_ORDER.indexOf(slug)
          if (i >= 0 && i < CASE_ORDER.length - 1) navigate(`/case/${CASE_ORDER[i + 1]}`)
          else navigate('/', { state: { scrollToWorks: true } })
        }}
      >
        <img src="/assets/right.svg" alt="" draggable="false" />
      </button>
    </div>
  )

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
      <div className="header-row">
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
        <MusicPlayer />
      </div>
      </header>

      {/* Case Hero */}
      {!DOC_CASE_SLUGS.includes(slug) && (
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
      )}

      {slug === 'colb-finance' && caseTranslation?.content && (() => {
        const nav = caseTranslation.nav
        const content = caseTranslation.content
        return (
          <ColbCaseBody
            footer={caseNav}
            sectionIds={['context', 'motion-videos', 'brand-social', 'one-pager', 'gitbook', 'brand-kit', 'output']}
            navItems={[
              { id: 'context', label: nav.context },
              {
                label: nav.process,
                children: [
                  { id: 'motion-videos', label: nav.motionVideos },
                  { id: 'brand-social', label: nav.brandSocial },
                  { id: 'one-pager', label: nav.onePager },
                  { id: 'gitbook', label: nav.gitbook },
                  { id: 'brand-kit', label: nav.brandKit },
                ],
              },
              { id: 'output', label: nav.output },
            ]}
          >
            <section id="context" className="colb-section">
              <ColbLabel>{nav.context}</ColbLabel>
              <p className="colb-text">{content.context}</p>
            </section>

            <ColbLabel className="colb-process-label">{nav.process}</ColbLabel>

            <section id="motion-videos" className="colb-section">
              <p className="colb-section-label">{nav.motionVideos}</p>
              <p className="colb-text">{content.motionVideosP1a}</p>
              <ColbMedia items={[{ type: 'image', src: COLB_STORYBOARD, alt: 'Colb storyboard sequence' }]} />
              <p className="colb-text">{content.motionVideosP1b}</p>
              <ColbMedia
                items={COLB_MOTION_REST.map((src, i) => ({ type: 'video', src, alt: `Colb motion video ${i + 2}` }))}
              />
              <p className="colb-text">{content.motionVideosP2}</p>
              <ColbMedia items={[{ type: 'video', src: COLB_MOTION_MAIN, alt: 'Colb x PancakeSwap video' }]} />
            </section>

            <section id="brand-social" className="colb-section">
              <p className="colb-section-label">{nav.brandSocial}</p>
              <p className="colb-text">{content.extraNews}</p>
              <ColbMedia items={[{ type: 'image', src: COLB_EXTRA_NEWS, alt: 'Extra News banner template' }]} />
              <p className="colb-text">{content.editorial}</p>
              <ColbMedia
                items={COLB_BANNERS.map((src, i) => ({ type: 'image', src, alt: `Colb editorial banner ${i + 1}` }))}
              />
            </section>

            <section id="one-pager" className="colb-section">
              <p className="colb-section-label">{nav.onePager}</p>
              <p className="colb-text">{content.onePager}</p>
              <ColbMedia items={[{ type: 'image', src: COLB_ONE_PAGER, alt: 'Colb one pager document' }]} />
            </section>

            <section id="gitbook" className="colb-section">
              <p className="colb-section-label">{nav.gitbook}</p>
              <p className="colb-text">{content.gitbook}</p>
              <ColbMedia items={[{ type: 'image', src: COLB_GITBOOK, alt: 'Colb GitBook visuals' }]} />
              <a
                href="https://docs.colb.finance/"
                target="_blank"
                rel="noopener noreferrer"
                className="colb-inline-link colb-gitbook-link"
              >
                {content.gitbookLink}
              </a>
            </section>

            <section id="brand-kit" className="colb-section">
              <p className="colb-section-label">{nav.brandKit}</p>
              <p className="colb-text">{content.brandKit}</p>
              <a
                href="https://colb.notion.site/Brandkit-3bab18b18c1780fc988ed82a2438ce84"
                target="_blank"
                rel="noopener noreferrer"
                className="colb-inline-link colb-gitbook-link"
              >
                {content.brandKitLink}
              </a>
            </section>

            <section id="output" className="colb-section">
              <ColbLabel>{nav.output}</ColbLabel>
              <p className="colb-text">{content.output}</p>
            </section>
          </ColbCaseBody>
        )
      })()}

      {slug === 're-protocol' && caseTranslation?.content && (() => {
        const nav = caseTranslation.nav
        const content = caseTranslation.content
        return (
          <ColbCaseBody
            footer={caseNav}
            sectionIds={['context', 'motion-videos', 'output']}
            navItems={[
              { id: 'context', label: nav.context },
              { label: nav.process, children: [{ id: 'motion-videos', label: nav.motionVideos }] },
              { id: 'output', label: nav.output },
            ]}
          >
            <section id="context" className="colb-section">
              <ColbLabel>{nav.context}</ColbLabel>
              <p className="colb-text">{content.context}</p>
            </section>

            <ColbLabel className="colb-process-label">{nav.process}</ColbLabel>

            <section id="motion-videos" className="colb-section">
              <p className="colb-section-label">{nav.motionVideos}</p>
              <p className="colb-text">{content.motionVideos}</p>
              <ColbMedia
                items={RE_VIDEOS.map((src, i) => ({ type: 'video', src, alt: `Re motion video ${i + 1}` }))}
              />
            </section>

            <section id="output" className="colb-section">
              <ColbLabel>{nav.output}</ColbLabel>
              <p className="colb-text">{content.output}</p>
            </section>
          </ColbCaseBody>
        )
      })()}

      {slug === 'sova-labs' && caseTranslation?.content && (() => {
        const nav = caseTranslation.nav
        const content = caseTranslation.content
        return (
          <ColbCaseBody
            footer={caseNav}
            sectionIds={['context', 'motion-videos', 'banners', 'output']}
            navItems={[
              { id: 'context', label: nav.context },
              {
                label: nav.process,
                children: [
                  { id: 'motion-videos', label: nav.motionVideos },
                  { id: 'banners', label: nav.banners },
                ],
              },
              { id: 'output', label: nav.output },
            ]}
          >
            <section id="context" className="colb-section">
              <ColbLabel>{nav.context}</ColbLabel>
              <p className="colb-text">{content.context}</p>
            </section>

            <ColbLabel className="colb-process-label">{nav.process}</ColbLabel>

            <section id="motion-videos" className="colb-section">
              <p className="colb-section-label">{nav.motionVideos}</p>
              <p className="colb-text">{content.motionVideos}</p>
              <ColbMedia
                items={SOVA_VIDEOS.map((src, i) => ({ type: 'video', src, alt: `Sova motion video ${i + 1}` }))}
              />
            </section>

            <section id="banners" className="colb-section">
              <p className="colb-section-label">{nav.banners}</p>
              <p className="colb-text">{content.banners}</p>
              <ColbMedia
                items={SOVA_BANNERS.map((src, i) => ({ type: 'image', src, alt: `Sova banner ${i + 1}` }))}
              />
            </section>

            <section id="output" className="colb-section">
              <ColbLabel>{nav.output}</ColbLabel>
              <p className="colb-text">{content.output}</p>
            </section>
          </ColbCaseBody>
        )
      })()}

      {/* Filter */}
      {!DOC_CASE_SLUGS.includes(slug) && (() => {
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
      {!DOC_CASE_SLUGS.includes(slug) && (() => {
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
                <VideoItem
                  src={item.src}
                  alt={`${caseData.company} work ${originalIndex + 1}`}
                  priority={originalIndex < 2}
                />
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

      {/* Doc-style cases render caseNav inside ColbCaseBody's content column
          (aligned with it, not spanning back under the sidebar); other case
          layouts don't have a sidebar to avoid, so it renders here instead. */}
      {!DOC_CASE_SLUGS.includes(slug) && caseNav}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-main">
          <a href={`/assets/cv-${lang}.pdf`} target="_blank" rel="noopener noreferrer" className="footer-cv">{t.cv}</a>
          <a href="mailto:glebaaagleb@gmail.com" className="footer-email">
            glebaaagleb@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}

export default CasePage

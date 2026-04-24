import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useFadeIn from './useFadeIn.js'

function VideoItem({ src, alt }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const handlePlay = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => {})
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        preload="auto"
        aria-label={alt}
        onLoadedData={(e) => e.target.parentElement.classList.add('loaded')}
        onLoadedMetadata={(e) => e.target.parentElement.classList.add('loaded')}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        controls={playing}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
      />
      {!playing && (
        <button
          type="button"
          className="video-play-btn"
          aria-label="Play video"
          onClick={handlePlay}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 20,12 0,24" fill="#fff" />
          </svg>
        </button>
      )}
    </>
  )
}

const API_URL = import.meta.env.VITE_API_URL || ''

const casesData = {
  'colb-finance': {
    company: 'Colb.finance',
    url: 'https://x.com/ColbFinance',
    role: 'Visuals for X/Twitter',
    period: 'Sep 2025 — Present',
    description: 'Full-cycle design for a Swiss fintech project: from high-fidelity web prototyping and technical documentation to brand graphics, motion design, and UI assets for Twitter and Discord.',
    skills: ['UX/UI', 'Web Prototyping', 'Brand Identity', 'Motion Design'],
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
    role: 'Visuals for X/Twitter',
    period: 'Jan 2026 — Present',
    description: 'Spearheaded the end-to-end creative direction, including 2D motion design and high-impact marketing graphics. Developed a comprehensive system of reusable design templates to streamline future content production and ensure long-term brand consistency.',
    skills: ['Creative Direction', '2D Motion Design', 'Design System', 'Marketing Design'],
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
    role: 'Visuals for X/Twitter',
    period: 'Dec 2025 — Jan 2026',
    description: 'Partnered with a 3D designer to produce high-end explainer and promotional animations for the official X account. Managed the full cycle of video creation to enhance brand presence and community engagement.',
    skills: ['Creative Direction', 'Motion Design', '3D Animation', 'Video Production'],
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

function CasePage({ theme, setTheme }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const caseData = casesData[slug]
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
          <h2>Case not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="page" ref={pageRef}>
      {/* Header */}
      <header className="header">
        <div className="theme-toggle">
          <button className={`theme-btn${theme === 'light' ? ' active' : ''}`} onClick={() => setTheme('light')}>
            <svg className="theme-icon" width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 0.75H6.7575M12.75 6.75H12.7575M6.75 12.75H6.7575M0.75 6.75H0.7575M10.9927 2.50725H11.0002M10.9927 10.9927H11.0002M2.50725 10.9927H2.51475M2.50725 2.50725H2.51475M9.75 6.75C9.75 8.40685 8.40685 9.75 6.75 9.75C5.09315 9.75 3.75 8.40685 3.75 6.75C3.75 5.09315 5.09315 3.75 6.75 3.75C8.40685 3.75 9.75 5.09315 9.75 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Light
          </button>
          <button className={`theme-btn${theme === 'dark' ? ' active' : ''}`} onClick={() => setTheme('dark')}>
            <svg className="theme-icon" width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.4896 6.93267C12.4284 8.06581 12.0404 9.15697 11.3723 10.0743C10.7042 10.9915 9.78471 11.6957 8.72499 12.1016C7.66527 12.5074 6.51066 12.5976 5.40076 12.3613C4.29085 12.125 3.27316 11.5722 2.4707 10.7699C1.66824 9.96748 1.11537 8.94984 0.878925 7.83996C0.64248 6.73008 0.732581 5.57547 1.13834 4.5157C1.54409 3.45593 2.24813 2.53638 3.16535 1.8682C4.08256 1.20003 5.17369 0.811829 6.30682 0.750539C6.57115 0.736181 6.70952 1.05077 6.56919 1.27464C6.09985 2.02557 5.89888 2.91342 5.99908 3.79328C6.09928 4.67313 6.49474 5.49305 7.12091 6.11923C7.74709 6.74541 8.56701 7.14086 9.44687 7.24106C10.3267 7.34127 11.2146 7.14029 11.9655 6.67095C12.19 6.53063 12.504 6.66834 12.4896 6.93267Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dark
          </button>
        </div>
        <nav className="nav">
          <span className="nav-link" onClick={() => navigate('/')} role="button" tabIndex={0}>home</span>
        </nav>
      </header>

      {/* Case Hero */}
      <section className="case-hero">
        <h1 className="case-title"><a href={caseData.url} target="_blank" rel="noopener noreferrer">{caseData.company}<span className="hero-dot">.</span></a></h1>
        {caseData.description && (
          <p className="case-description">{caseData.description}</p>
        )}
        {caseData.skills && caseData.skills.length > 0 && (
          <ul className="case-skills">
            {Array.from({ length: Math.ceil(caseData.skills.length / 2) }, (_, ri) => (
              <li key={ri} className="case-skills-row">
                {caseData.skills.slice(ri * 2, ri * 2 + 2).map((skill) => (
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
              All
            </button>
            <button
              className={`case-filter-btn${filter === 'video' ? ' active' : ''}`}
              onClick={() => setFilter('video')}
              type="button"
            >
              Videos
            </button>
            <button
              className={`case-filter-btn${filter === 'image' ? ' active' : ''}`}
              onClick={() => setFilter('image')}
              type="button"
            >
              Banners
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
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/gleb-dihtievsky/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/assets/icon-social-3.svg" alt="LinkedIn" />
            </a>
            <a href="https://t.me/glebaagleb" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/assets/icon-social-1.svg" alt="Telegram" />
            </a>
            <a href="https://x.com/glebaagleb" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/assets/icon-social-2.svg" alt="X" />
            </a>
          </div>
          <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" className="footer-cv">CV</a>
          <a href="mailto:glebaaagleb@gmail.com" className="footer-email">
            glebaaagleb@gmail.com
          </a>
        </div>
        <div className="footer-copy">© 2026 Gleb Dihtievsky. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default CasePage

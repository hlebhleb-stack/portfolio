import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import CasePage from './CasePage.jsx'
import useFadeIn from './useFadeIn.js'
import { translations, LANGS } from './translations.jsx'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function getSessionId() {
  try {
    let id = sessionStorage.getItem('sid')
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
        Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('sid', id)
    }
    return id
  } catch {
    return ''
  }
}

function trackPage(page, lang) {
  fetch(`${API_URL}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page,
      screenWidth: window.innerWidth,
      lang: lang || (typeof document !== 'undefined' ? document.documentElement.lang : ''),
      sessionId: getSessionId(),
    }),
  }).catch(() => {})
}

const HERO_TEXT = 'Designing for brands that move fast. Motion, graphics, and everything in between.'

function HomePage({ theme, setTheme, lang, setLang }) {
  const pageRef = useFadeIn()
  const sectionsRef = useRef(null)
  const location = useLocation()
  const t = translations[lang]
  const [typed, setTyped] = useState('')
  const [caretPhase, setCaretPhase] = useState('typing')
  const [hoveredSocial, setHoveredSocial] = useState(null)
  const [pressedWork, setPressedWork] = useState(null)
  const isPressed = (i) => location.pathname === '/' && pressedWork === i

  useEffect(() => {
    const el = sectionsRef.current
    if (!el) return
    const saved = sessionStorage.getItem('homeScrollY')
    if (saved !== null) {
      const prev = el.style.scrollBehavior
      el.style.scrollBehavior = 'auto'
      el.scrollTop = parseFloat(saved)
      el.style.scrollBehavior = prev
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        sessionStorage.setItem('homeScrollY', String(el.scrollTop))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const clear = () => setHoveredSocial(null)
    const onVis = () => { if (document.hidden) clear() }
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const langRef = useRef(lang)
  useEffect(() => { langRef.current = lang }, [lang])
  const prevPathRef = useRef(null)
  useEffect(() => {
    const prev = prevPathRef.current
    prevPathRef.current = location.pathname
    if (location.pathname === '/' && prev !== '/') {
      trackPage('/', langRef.current)
    }
  }, [location.pathname])

  useEffect(() => {
    const startDelay = 250
    const charInterval = 35
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setTyped(HERO_TEXT.slice(0, i))
        if (i >= HERO_TEXT.length) {
          clearInterval(id)
          setCaretPhase('blinking')
          setTimeout(() => setCaretPhase('hidden'), 1500)
        }
      }, charInterval)
    }, startDelay)
    return () => clearTimeout(start)
  }, [])

  const works = [
    { company: 'Colb.finance', slug: 'colb-finance' },
    { company: 'Sova Labs', slug: 'sova-labs' },
    { company: 'Re Protocol', slug: 're-protocol' },
  ]

  return (
    <div className="home-page" ref={pageRef}>
      {/* Header (fixed) */}
      <header className="header home-header">
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

      {/* Snap-scroll sections */}
      <main className="home-sections" ref={sectionsRef}>
        {/* Section 1 — hero */}
        <section className="home-section home-section-photo">
          <div className="hero">
            <h1 className="hero-title">
              <span className="hero-highlight">{typed}</span>
              {caretPhase !== 'hidden' && (
                <span
                  className={`hero-caret${caretPhase === 'blinking' ? ' is-blinking' : ''}`}
                  aria-hidden="true"
                />
              )}
            </h1>
          </div>
        </section>

        {/* Section 2 — works (folder icons) */}
        <section className="home-section home-section-works" id="works">
          <div className="works-folders">
            {works.map((work, i) => (
              <Link
                key={i}
                to={`/case/${work.slug}`}
                className={`work-folder${isPressed(i) ? ' is-pressed' : ''}`}
                onTouchStart={() => {
                  setPressedWork(i)
                  setTimeout(() => setPressedWork(null), 180)
                }}
                onTouchEnd={() => setPressedWork(null)}
                onTouchCancel={() => setPressedWork(null)}
              >
                <img src="/assets/folder-ios.png" alt="" className="work-folder-icon" draggable="false" />
                <span className="work-folder-label">{work.company}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3 — socials */}
        <section className="home-section home-section-socials" id="links">
          <div className="home-socials">
            {[
              { id: 'tg', href: 'https://t.me/glebaagleb', src: '/assets/socials/tg.svg', alt: 'Telegram' },
              { id: 'linkedin', href: 'https://www.linkedin.com/in/gleb-dihtievsky/', src: '/assets/socials/linkedin.svg', alt: 'LinkedIn' },
              { id: 'x', href: 'https://x.com/glebaagleb', src: '/assets/socials/x.svg', alt: 'X' },
            ].map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`home-social${hoveredSocial === s.id ? ' is-hover' : ''}`}
                onMouseEnter={() => setHoveredSocial(s.id)}
                onMouseLeave={() => setHoveredSocial(null)}
                onClick={() => setHoveredSocial(null)}
              >
                <img src={s.src} alt={s.alt} />
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer (fixed) */}
      <footer className="footer home-footer">
        <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" className="footer-cv">{t.cv}</a>
        <a href="mailto:glebaaagleb@gmail.com" className="footer-email">
          glebaaagleb@gmail.com
        </a>
      </footer>
    </div>
  )
}

function App() {
  const cursorRef = useRef(null)
  const [theme, setTheme] = useState('light')
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    const stored = window.localStorage.getItem('lang')
    return translations[stored] ? stored : 'en'
  })
  const setLang = (l) => {
    setLangState(l)
    try { window.localStorage.setItem('lang', l) } catch { /* ignore */ }
  }
  const location = useLocation()

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    const onMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const isHome = location.pathname === '/'

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} />
      <div className={`page-transition home-wrap${isHome ? '' : ' is-hidden'}`}>
        <HomePage theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />
      </div>
      <Routes>
        <Route path="/case/:slug" element={
          <div className="page-transition" key={location.pathname}>
            <CasePage theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />
          </div>
        } />
      </Routes>
    </>
  )
}

export default App

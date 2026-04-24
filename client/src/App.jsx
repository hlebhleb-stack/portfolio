import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import CasePage from './CasePage.jsx'
import HeaderMenu from './HeaderMenu.jsx'
import useFadeIn from './useFadeIn.js'
import { translations, LANGS } from './translations.jsx'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function trackPage(page) {
  fetch(`${API_URL}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page,
      referrer: document.referrer,
      screenWidth: window.innerWidth,
    }),
  }).catch(() => {})
}

function renderBioHighlighted(text, highlights) {
  if (!text) return null
  const ranges = []
  for (const term of highlights) {
    let from = 0
    while (from < text.length) {
      const idx = text.indexOf(term, from)
      if (idx === -1) break
      ranges.push([idx, idx + term.length])
      from = idx + term.length
    }
  }
  ranges.sort((a, b) => a[0] - b[0])
  const parts = []
  let cursor = 0
  ranges.forEach(([start, end], i) => {
    if (start >= text.length) return
    const clampedEnd = Math.min(end, text.length)
    if (cursor < start) {
      parts.push(<span key={`m${i}`}>{text.slice(cursor, start)}</span>)
    }
    parts.push(
      <span key={`h${i}`} className="hero-bio-highlight">
        {text.slice(start, clampedEnd)}
      </span>
    )
    cursor = clampedEnd
  })
  if (cursor < text.length) {
    parts.push(<span key="tail">{text.slice(cursor)}</span>)
  }
  return parts
}

function HomePage({ theme, setTheme, lang, setLang }) {
  const pageRef = useFadeIn()
  const t = translations[lang]
  const bio = t.heroBio
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [animatingBio, setAnimatingBio] = useState(bio)

  if (animatingBio !== bio) {
    setAnimatingBio(bio)
    setTyped('')
    setTypingDone(false)
  }

  useEffect(() => {
    trackPage('/')
  }, [])

  useEffect(() => {
    const startDelay = 250
    const charInterval = 22
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setTyped(animatingBio.slice(0, i))
        if (i >= animatingBio.length) {
          clearInterval(id)
          setTimeout(() => setTypingDone(true), 500)
        }
      }, charInterval)
    }, startDelay)
    return () => clearTimeout(start)
  }, [animatingBio])

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

      {/* Photo */}
      <div className="photo-portrait fade-in-up">
        <div className="photo-wrapper">
          <img src="/assets/photo-portrait.jpg" alt="Gleb Dihtievsky" className="photo-img" />
          <div className="photo-overlay" />
        </div>
      </div>

      {/* Hero */}
      <section className="hero fade-in-up">
        <p className="hero-bio">
          <span className="hero-bio-text">
            {renderBioHighlighted(typed, t.heroBioHighlights || [])}
          </span>
          {!typingDone && <span className="hero-caret" aria-hidden="true" />}
        </p>
      </section>

      {/* Footer */}
      <footer className="footer fade-in-up" id="links">
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
          <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" className="footer-cv">{t.cv}</a>
          <a href="mailto:glebaaagleb@gmail.com" className="footer-email">
            glebaaagleb@gmail.com
          </a>
        </div>
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

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} />
      <div className="page-transition" key={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />} />
          <Route path="/case/:slug" element={<CasePage theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />} />
        </Routes>
      </div>
    </>
  )
}

export default App

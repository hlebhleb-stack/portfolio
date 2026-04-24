import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import CasePage from './CasePage.jsx'
import useFadeIn from './useFadeIn.js'
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

function HomePage({ theme, setTheme }) {
  const pageRef = useFadeIn()
  const fullName = 'Gleb Dihtievsky'
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    trackPage('/')
  }, [])

  useEffect(() => {
    const startDelay = 250
    const charInterval = 55
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setTyped(fullName.slice(0, i))
        if (i >= fullName.length) {
          clearInterval(id)
          setTimeout(() => setTypingDone(true), 700)
        }
      }, charInterval)
    }, startDelay)
    return () => clearTimeout(start)
  }, [])

  const works = [
    {
      company: 'Colb.finance',
      role: 'Visuals for X/Twitter',
      period: 'Sep 2025 — Present',
      slug: 'colb-finance',
    },
    {
      company: 'Sova Labs',
      role: 'Visuals for X/Twitter',
      period: 'Jan 2026 — Present',
      slug: 'sova-labs',
    },
    {
      company: 'Re Protocol',
      role: 'Visuals for X/Twitter',
      period: 'Dec 2025 — Jan 2026',
      slug: 're-protocol',
    },
  ]

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
          <a href="#works" className="nav-link">works</a>
          <a href="#links" className="nav-link">links</a>
        </nav>
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
        <h1 className="hero-name">
          <span className="hero-name-text">{typed}</span>
          {!typingDone && <span className="hero-caret" aria-hidden="true" />}
          {typingDone && <span className="hero-dot">.</span>}
        </h1>
        <p className="hero-role">Visual Designer</p>
      </section>

      {/* Experience */}
      <section className="experience" id="works">
        <h2 className="experience-title fade-in-up">Experience</h2>
        <div className="works">
          <div className="divider fade-in-up" />
          {works.map((work, i) => (
            <React.Fragment key={i}>
              <Link
                to={`/case/${work.slug}`}
                className="work-row fade-in-up"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="work-company">{work.company}</span>
                <span className="work-role">{work.role}</span>
                <span className="work-period">{work.period}</span>
              </Link>
              <div className="divider fade-in-up" />
            </React.Fragment>
          ))}
        </div>
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

function App() {
  const cursorRef = useRef(null)
  const [theme, setTheme] = useState('light')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

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
          <Route path="/" element={<HomePage theme={theme} setTheme={setTheme} />} />
          <Route path="/case/:slug" element={<CasePage theme={theme} setTheme={setTheme} />} />
        </Routes>
      </div>
    </>
  )
}

export default App

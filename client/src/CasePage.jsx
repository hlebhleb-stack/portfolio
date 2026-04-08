import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useFadeIn from './useFadeIn.js'

const casesData = {
  'colb-finance': {
    company: 'Colb.finance',
    role: 'Visuals for X/Twitter',
    period: 'Sep 2025 — Present',
    description: 'Creating engaging visual content and motion graphics for Colb.finance social media presence on X/Twitter.',
    items: [
      { type: 'image', label: 'Post Visual #1' },
      { type: 'image', label: 'Post Visual #2' },
      { type: 'video', label: 'Animation #1' },
      { type: 'image', label: 'Post Visual #3' },
      { type: 'video', label: 'Animation #2' },
      { type: 'image', label: 'Post Visual #4' },
    ],
  },
  'sova-labs': {
    company: 'Sova Labs',
    role: 'Visuals for X/Twitter',
    period: 'Jan 2026 — Present',
    description: 'Designing visual identity and social media content for Sova Labs across X/Twitter channels.',
    items: [
      { type: 'image', label: 'Brand Visual #1' },
      { type: 'video', label: 'Motion Piece #1' },
      { type: 'image', label: 'Brand Visual #2' },
      { type: 'image', label: 'Brand Visual #3' },
      { type: 'video', label: 'Motion Piece #2' },
      { type: 'image', label: 'Brand Visual #4' },
    ],
  },
  're-protocol': {
    company: 'Re Protocol',
    role: 'Visuals for X/Twitter',
    period: 'Dec 2025 — Jan 2026',
    description: 'Developed visual content and animations for Re Protocol marketing campaigns on X/Twitter.',
    items: [
      { type: 'image', label: 'Campaign Visual #1' },
      { type: 'image', label: 'Campaign Visual #2' },
      { type: 'video', label: 'Promo Video #1' },
      { type: 'image', label: 'Campaign Visual #3' },
      { type: 'image', label: 'Campaign Visual #4' },
      { type: 'video', label: 'Promo Video #2' },
    ],
  },
}

function CasePage({ theme, setTheme }) {
  const { slug } = useParams()
  const caseData = casesData[slug]
  const pageRef = useFadeIn()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!caseData) {
    return (
      <div className="page">
        <header className="header">
          <Link to="/" className="back-link">&larr; Back</Link>
        </header>
        <div className="case-not-found">
          <h2>Case not found</h2>
          <Link to="/" className="back-btn">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page" ref={pageRef}>
      {/* Header */}
      <header className="header fade-in-up">
        <div className="theme-toggle">
          <button className={`theme-btn${theme === 'light' ? ' active' : ''}`} onClick={() => setTheme('light')}>
            <svg className="theme-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 0.75H6.7575M12.75 6.75H12.7575M6.75 12.75H6.7575M0.75 6.75H0.7575M10.9927 2.50725H11.0002M10.9927 10.9927H11.0002M2.50725 10.9927H2.51475M2.50725 2.50725H2.51475M9.75 6.75C9.75 8.40685 8.40685 9.75 6.75 9.75C5.09315 9.75 3.75 8.40685 3.75 6.75C3.75 5.09315 5.09315 3.75 6.75 3.75C8.40685 3.75 9.75 5.09315 9.75 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Light
          </button>
          <button className={`theme-btn${theme === 'dark' ? ' active' : ''}`} onClick={() => setTheme('dark')}>
            <svg className="theme-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.4896 6.93267C12.4284 8.06581 12.0404 9.15697 11.3723 10.0743C10.7042 10.9915 9.78471 11.6957 8.72499 12.1016C7.66527 12.5074 6.51066 12.5976 5.40076 12.3613C4.29085 12.125 3.27316 11.5722 2.4707 10.7699C1.66824 9.96748 1.11537 8.94984 0.878925 7.83996C0.64248 6.73008 0.732581 5.57547 1.13834 4.5157C1.54409 3.45593 2.24813 2.53638 3.16535 1.8682C4.08256 1.20003 5.17369 0.811829 6.30682 0.750539C6.57115 0.736181 6.70952 1.05077 6.56919 1.27464C6.09985 2.02557 5.89888 2.91342 5.99908 3.79328C6.09928 4.67313 6.49474 5.49305 7.12091 6.11923C7.74709 6.74541 8.56701 7.14086 9.44687 7.24106C10.3267 7.34127 11.2146 7.14029 11.9655 6.67095C12.19 6.53063 12.504 6.66834 12.4896 6.93267Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dark
          </button>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">home</Link>
        </nav>
      </header>

      {/* Case Hero */}
      <section className="case-hero fade-in-up">
        <h1 className="case-title">{caseData.company}<span className="hero-dot">.</span></h1>
        <p className="case-role">{caseData.role}</p>
        <p className="case-period">{caseData.period}</p>
        <p className="case-description">{caseData.description}</p>
      </section>

      {/* Case Grid */}
      <section className="case-grid">
        {caseData.items.map((item, i) => (
          <div
            key={i}
            className="case-item fade-in-up"
            style={{ transitionDelay: `${(i % 2) * 0.1}s` }}
          >
            <div className={`case-placeholder ${item.type === 'video' ? 'is-video' : ''}`}>
              <span className="placeholder-label">{item.label}</span>
              {item.type === 'video' && (
                <svg className="play-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 16L33 24L19 32V16Z" fill="currentColor"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Back button */}
      <div className="case-back fade-in-up">
        <Link to="/" className="back-btn">&larr; Back to home</Link>
      </div>
    </div>
  )
}

export default CasePage

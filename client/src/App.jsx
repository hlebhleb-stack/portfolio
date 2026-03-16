import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const onMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const works = [
    {
      company: 'Colb.finance',
      role: 'Visuals for X/Twitter',
      period: 'Sep 2025 — Present',
    },
    {
      company: 'Sova Labs',
      role: 'Visuals for X/Twitter',
      period: 'Jan 2026 — Present',
    },
    {
      company: 'Re Protocol',
      role: 'Visuals for X/Twitter',
      period: 'Dec 2025 — Jan 2026',
    },
  ]

  return (
    <div className="page">
      <div className="custom-cursor" ref={cursorRef} />
      {/* Navigation */}
      <nav className="nav">
        <a href="#about" className="nav-link">about me</a>
        <a href="#works" className="nav-link">works</a>
        <a href="#links" className="nav-link">links</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-name">Gleb Dihtievsky<span className="hero-dot">.</span></h1>
        <p className="hero-role">Visual Designer</p>
      </section>

      {/* Works */}
      <section className="works" id="works">
        <div className="divider" />
        {works.map((work, i) => (
          <div key={i}>
            <div className="work-row">
              <span className="work-company">{work.company}</span>
              <span className="work-role">{work.role}</span>
              <span className="work-period">{work.period}</span>
            </div>
            <div className="divider" />
          </div>
        ))}
      </section>

      {/* About */}
      <section className="about" id="about">
        <div className="about-photo">
          <img src="/assets/photo-portrait.png" alt="Gleb Dihtievsky" />
        </div>
        <div className="about-info">
          <p className="about-text">
            <span className="text-medium">Education:</span> Belarusian State University of Informatics{'\u00A0'} and Radioelectronics
          </p>
          <p className="about-text about-experience">
            <span className="text-medium">Experience:</span> 5 years in Ux/Ui
          </p>
          <div className="divider-short" />
          <p className="about-text about-description">
            <span className="text-medium">About me:</span> Currently crafting the visuals for Colb and Sova. I love taking complicated tech and turning it into clean, fluid motion that actually makes sense. Always down to build something meaningful together.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="links">
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/gleb-dihtievsky/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/assets/icon-social-3.svg" alt="LinkedIn" />
          </a>
          <a href="https://t.me/@glebaagleb" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/assets/icon-social-1.svg" alt="Telegram" />
          </a>
          <a href="https://x.com/glebaagleb" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/assets/icon-social-2.svg" alt="X" />
          </a>
        </div>
        <a href="mailto:glebaaagleb@gmail.com" className="footer-email">
          glebaaagleb@gmail.com
        </a>
      </footer>
    </div>
  )
}

export default App

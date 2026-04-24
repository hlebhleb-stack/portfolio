import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { translations } from './translations.jsx'

const MENU_CASES = [
  { label: 'colb', slug: 'colb-finance' },
  { label: 'sova', slug: 'sova-labs' },
  { label: 're', slug: 're-protocol' },
]

export default function HeaderMenu({ theme, setTheme, lang }) {
  const [open, setOpen] = useState(false)
  const t = translations[lang]
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <div className={`menu-backdrop${open ? ' visible' : ''}`} aria-hidden="true" />
      <div className={`header-menu${open ? ' open' : ''}`} ref={rootRef}>
        <button
        type="button"
        className={`menu-plus${open ? ' rotated' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-plus-bar menu-plus-bar-h" />
        <span className="menu-plus-bar menu-plus-bar-v" />
        </button>

        {open && (
          <div className="menu-panel">
            <Link
              to="/"
              className="menu-item menu-item-flat"
              onClick={() => setOpen(false)}
            >
              {t.menu.home}
            </Link>
            <div className="menu-group">
              <div className="menu-group-title">{t.menu.works}</div>
              <ul className="menu-group-list">
                {MENU_CASES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/case/${c.slug}`}
                      className="menu-item"
                      onClick={() => setOpen(false)}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="menu-item menu-theme-toggle"
              aria-label={t.menu.switchTheme}
              onClick={() => {
                toggleTheme()
                setOpen(false)
              }}
            >
              <span className={`theme-icon-wrap${theme === 'dark' ? ' is-dark' : ''}`}>
                <svg
                  className="theme-icon-svg theme-icon-moon"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                >
                  <path d="M12.4896 6.93267C12.4284 8.06581 12.0404 9.15697 11.3723 10.0743C10.7042 10.9915 9.78471 11.6957 8.72499 12.1016C7.66527 12.5074 6.51066 12.5976 5.40076 12.3613C4.29085 12.125 3.27316 11.5722 2.4707 10.7699C1.66824 9.96748 1.11537 8.94984 0.878925 7.83996C0.64248 6.73008 0.732581 5.57547 1.13834 4.5157C1.54409 3.45593 2.24813 2.53638 3.16535 1.8682C4.08256 1.20003 5.17369 0.811829 6.30682 0.750539C6.57115 0.736181 6.70952 1.05077 6.56919 1.27464C6.09985 2.02557 5.89888 2.91342 5.99908 3.79328C6.09928 4.67313 6.49474 5.49305 7.12091 6.11923C7.74709 6.74541 8.56701 7.14086 9.44687 7.24106C10.3267 7.34127 11.2146 7.14029 11.9655 6.67095C12.19 6.53063 12.504 6.66834 12.4896 6.93267Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg
                  className="theme-icon-svg theme-icon-sun"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                >
                  <path d="M6.75 0.75H6.7575M12.75 6.75H12.7575M6.75 12.75H6.7575M0.75 6.75H0.7575M10.9927 2.50725H11.0002M10.9927 10.9927H11.0002M2.50725 10.9927H2.51475M2.50725 2.50725H2.51475M9.75 6.75C9.75 8.40685 8.40685 9.75 6.75 9.75C5.09315 9.75 3.75 8.40685 3.75 6.75C3.75 5.09315 5.09315 3.75 6.75 3.75C8.40685 3.75 9.75 5.09315 9.75 6.75Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

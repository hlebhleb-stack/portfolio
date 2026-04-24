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
              className="menu-item menu-item-flat"
              onClick={() => {
                toggleTheme()
                setOpen(false)
              }}
            >
              {t.menu.switchTheme}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

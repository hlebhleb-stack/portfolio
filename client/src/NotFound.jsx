import { Link } from 'react-router-dom'
import { translations } from './translations.jsx'
import { useEffect, useRef } from 'react'

export default function NotFound({ lang }) {
  const t = translations[lang]
  const faceRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = faceRef.current
    if (!el) return

    const size = 150
    let x = Math.random() * (window.innerWidth - size)
    let y = Math.random() * (window.innerHeight - size)
    let dx = 2
    let dy = 2
    let hue = 0

    function step() {
      const w = window.innerWidth - size
      const h = window.innerHeight - size

      x += dx
      y += dy

      let hit = false
      if (x <= 0) { x = 0; dx = Math.abs(dx); hit = true }
      if (x >= w) { x = w; dx = -Math.abs(dx); hit = true }
      if (y <= 0) { y = 0; dy = Math.abs(dy); hit = true }
      if (y >= h) { y = h; dy = -Math.abs(dy); hit = true }

      if (hit) {
        hue = (hue + 60 + Math.random() * 60) % 360
        el.style.filter = `hue-rotate(${hue}deg)`
      }

      el.style.transform = `translate(${x}px, ${y}px)`
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="not-found-page">
      <img
        ref={faceRef}
        src="/assets/face.png"
        alt=""
        className="dvd-face"
      />
      <Link to="/" className="not-found-center">404</Link>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

const TRACKS = [
  {
    id: 'bulletproof',
    title: 'Bulletproof... I Wish I Was',
    icon: '/assets/radiohead-bulletproof.png',
    src: '/assets/radiohead-bulletproof.mp3',
  },
  {
    id: 'exitmusic',
    title: 'Exit Music (For a Film)',
    icon: '/assets/radiohead-exitmusic.png',
    src: '/assets/radiohead-exitmusic.mp3',
  },
]

let sharedAudio = null
function getAudio() {
  if (!sharedAudio) sharedAudio = new Audio()
  return sharedAudio
}

const MENU_CLOSE_FALLBACK_MS = 300

export default function MusicPlayer() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuRendered, setMenuRendered] = useState(false)
  const [menuEntered, setMenuEntered] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const wrapRef = useRef(null)
  const fallbackTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!menuRendered || !menuOpen) return undefined
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMenuEntered(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [menuRendered, menuOpen])

  const openMenu = () => {
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current)
    setMenuOpen(true)
    setMenuRendered(true)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuEntered(false)
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current)
    fallbackTimeoutRef.current = setTimeout(() => {
      setMenuRendered(false)
    }, MENU_CLOSE_FALLBACK_MS)
  }

  const handleMenuTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return
    if (!menuOpen) {
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current)
      setMenuRendered(false)
    }
  }

  useEffect(() => {
    const audio = getAudio()
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentId(null)
    }
    const onPause = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play', onPlay)
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play', onPlay)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  const handleSelectTrack = (track) => {
    const audio = getAudio()
    if (currentId === track.id) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play().catch(() => {})
      }
    } else {
      audio.src = track.src
      audio.play().catch(() => {})
      setCurrentId(track.id)
    }
    closeMenu()
  }

  const handleStop = () => {
    const audio = getAudio()
    audio.pause()
    audio.removeAttribute('src')
    setCurrentId(null)
    closeMenu()
  }

  const currentTrack = TRACKS.find((track) => track.id === currentId)

  return (
    <div className="music-player" ref={wrapRef}>
      <button
        type="button"
        className="theme-toggle-btn music-toggle-btn"
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
        aria-label="Toggle music menu"
      >
        <img
          src={currentTrack ? currentTrack.icon : '/assets/vinyl.svg'}
          alt=""
          className={`music-icon${currentTrack ? ' music-icon-active' : ''}`}
          draggable="false"
        />
      </button>

      {menuRendered && (
        <div
          className={`music-menu${menuEntered ? ' is-entered' : ''}`}
          onTransitionEnd={handleMenuTransitionEnd}
        >
          {currentTrack && (
            <button
              type="button"
              className="music-menu-item"
              onClick={handleStop}
            >
              <img src="/assets/vinyl.svg" alt="" className="music-menu-icon music-menu-icon-vinyl" draggable="false" />
              <span className="music-menu-title">pls turn off</span>
            </button>
          )}
          {TRACKS.map((track) => (
            <button
              key={track.id}
              type="button"
              className={`music-menu-item${currentId === track.id ? ' active' : ''}`}
              onClick={() => handleSelectTrack(track)}
            >
              <img src={track.icon} alt="" className="music-menu-icon" draggable="false" />
              <span className="music-menu-title">{track.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

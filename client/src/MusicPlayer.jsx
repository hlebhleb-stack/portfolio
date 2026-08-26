import { useEffect, useRef, useState } from 'react'

const TRACKS = [
  {
    id: 'glasshouse',
    title: 'Life in a Glasshouse',
    icon: '/assets/radiohead-glasshouse.png',
    src: '/assets/radiohead-glasshouse.mp3',
  },
  {
    id: 'exitmusic',
    title: 'Exit Music (For a Film)',
    icon: '/assets/radiohead-exitmusic.png',
    src: '/assets/radiohead-exitmusic.mp3',
  },
  {
    id: 'dumb',
    title: 'Dumb',
    icon: '/assets/nirvana-dumb.png',
    src: '/assets/nirvana-dumb.mp3',
  },
]

let sharedAudio = null
function getAudio() {
  if (!sharedAudio) sharedAudio = new Audio()
  return sharedAudio
}

function findTrackIdForAudio(audio) {
  if (!audio.src) return null
  const track = TRACKS.find((t) => audio.src.endsWith(t.src))
  return track ? track.id : null
}

const MENU_CLOSE_FALLBACK_MS = 320

export default function MusicPlayer() {
  // 'closed' -> not in DOM. 'entering' -> just mounted, about to transition to open on
  // the next frame. 'open' -> resting open state. 'closing' -> transitioning out.
  const [menuPhase, setMenuPhase] = useState('closed')
  // The audio element is a module-level singleton that survives navigation between
  // pages, but each mounted MusicPlayer (Home, CasePage) starts with fresh state —
  // read the singleton's actual src/paused status instead of assuming nothing is
  // playing, so the header icon doesn't fall back to the plain vinyl on navigation.
  const [currentId, setCurrentId] = useState(() => findTrackIdForAudio(getAudio()))
  const [isPlaying, setIsPlaying] = useState(() => {
    const audio = getAudio()
    return Boolean(audio.src) && !audio.paused && !audio.ended
  })
  const [progress, setProgress] = useState(() => {
    const audio = getAudio()
    return audio.duration ? audio.currentTime / audio.duration : 0
  })
  const wrapRef = useRef(null)
  const menuRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  const openMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setMenuPhase('entering')
  }

  const closeMenu = () => {
    setMenuPhase((phase) => (phase === 'closed' ? 'closed' : 'closing'))
  }

  // Flip 'entering' -> 'open' a couple frames after mount, so the browser commits the
  // collapsed starting style before the transition to the open state kicks in.
  useEffect(() => {
    if (menuPhase !== 'entering') return
    let raf2 = null
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMenuPhase('open'))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [menuPhase])

  // Unmount once the close transition actually finishes, rather than guessing a fixed
  // delay — a real device under load can run the transition slower or faster than the
  // CSS duration, and a hardcoded timeout would then unmount too early (visible cutoff)
  // or leave a stale invisible node too long.
  useEffect(() => {
    if (menuPhase !== 'closing') return
    const node = menuRef.current
    const finish = () => setMenuPhase('closed')
    closeTimeoutRef.current = setTimeout(finish, MENU_CLOSE_FALLBACK_MS)
    const onTransitionEnd = (e) => {
      if (e.target !== node) return
      clearTimeout(closeTimeoutRef.current)
      finish()
    }
    node?.addEventListener('transitionend', onTransitionEnd)
    return () => {
      clearTimeout(closeTimeoutRef.current)
      node?.removeEventListener('transitionend', onTransitionEnd)
    }
  }, [menuPhase])

  useEffect(() => {
    const audio = getAudio()
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentId(null)
      setProgress(0)
    }
    const onPause = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onTimeUpdate = () => {
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    }
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [])

  useEffect(() => {
    if (menuPhase === 'closed') return
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuPhase])

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
      setProgress(0)
    }
    closeMenu()
  }

  const handleStop = () => {
    const audio = getAudio()
    audio.pause()
    audio.removeAttribute('src')
    setCurrentId(null)
    setProgress(0)
    closeMenu()
  }

  const currentTrack = TRACKS.find((track) => track.id === currentId)

  return (
    <div className="music-player" ref={wrapRef}>
      <button
        type="button"
        className="theme-toggle-btn music-toggle-btn"
        onClick={() => (menuPhase === 'closed' ? openMenu() : closeMenu())}
        aria-label="Toggle music menu"
      >
        <img
          src={currentTrack ? currentTrack.icon : '/assets/vinyl.svg'}
          alt=""
          className={`music-icon${currentTrack ? ' music-icon-active' : ''}`}
          draggable="false"
        />
      </button>

      {menuPhase !== 'closed' && (
        <div
          ref={menuRef}
          className={`music-menu${menuPhase === 'closing' ? ' is-closing' : menuPhase === 'entering' ? ' is-entering' : ''}`}
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
              <span className="music-menu-text">
                <span className="music-menu-title">{track.title}</span>
                {currentId === track.id && (
                  <span className="music-menu-progress">
                    <span
                      className="music-menu-progress-fill"
                      style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                    />
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

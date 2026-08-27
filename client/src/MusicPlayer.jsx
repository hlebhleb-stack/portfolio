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

// Warm the browser cache for every cover as soon as this module loads, so by the
// time the user opens the menu or switches tracks the images are already decoded
// instead of popping in.
if (typeof window !== 'undefined') {
  TRACKS.forEach((track) => {
    const img = new Image()
    img.src = track.icon
  })
}

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

// Case-page videos and the header music share one audio "channel" — only one
// should be audible at a time. Rather than reacting to specific mute-button
// clicks (which misses videos that resume playing on their own, e.g. an
// already-unmuted video scrolling back into view via IntersectionObserver),
// watch every video's actual play/pause/volume state directly and keep music
// in sync with reality. Installed once at module scope — two MusicPlayer
// instances are mounted at once (Home stays mounted with display:none behind
// case pages), and per-instance listeners would each keep their own
// "did I pause it" flag and race each other.
let pausedByVideo = false
let videoWatcherInstalled = false

function anyVideoAudible() {
  const videos = document.querySelectorAll('video')
  for (const v of videos) {
    if (!v.paused && !v.muted && v.volume > 0) return true
  }
  return false
}

function syncMusicWithVideos() {
  const audio = getAudio()
  if (anyVideoAudible()) {
    if (audio.src && !audio.paused) {
      pausedByVideo = true
      audio.pause()
    }
  } else if (pausedByVideo) {
    pausedByVideo = false
    if (audio.src) audio.play().catch(() => {})
  }
}

function setPausedByVideo(value) {
  pausedByVideo = value
}

function installVideoWatcher() {
  if (videoWatcherInstalled || typeof document === 'undefined') return
  videoWatcherInstalled = true
  // play/pause/volumechange don't bubble, so listen on the capturing phase
  // at the document to catch them from any video regardless of nesting.
  document.addEventListener('play', syncMusicWithVideos, true)
  document.addEventListener('pause', syncMusicWithVideos, true)
  document.addEventListener('volumechange', syncMusicWithVideos, true)
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

  useEffect(() => {
    installVideoWatcher()
  }, [])

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
    // A currently-audible video takes priority: defer actually starting
    // playback (just mark it as "paused for a video") rather than starting
    // music that the next video play/pause/volumechange event won't know to
    // stop, since the watcher only reacts to video-side events.
    const videoAudible = anyVideoAudible()
    if (currentId === track.id) {
      if (isPlaying) {
        setPausedByVideo(false)
        audio.pause()
      } else if (videoAudible) {
        setPausedByVideo(true)
      } else {
        audio.play().catch(() => {})
      }
    } else {
      audio.src = track.src
      setCurrentId(track.id)
      setProgress(0)
      if (videoAudible) {
        setPausedByVideo(true)
      } else {
        audio.play().catch(() => {})
      }
    }
    closeMenu()
  }

  const handleStop = () => {
    const audio = getAudio()
    setPausedByVideo(false)
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

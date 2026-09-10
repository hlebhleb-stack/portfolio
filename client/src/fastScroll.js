import { useSyncExternalStore } from 'react'

// Reports whether the page is currently being scrolled fast.
//
// A case page can have four to six videos on screen at once, and decoding them
// together is the heaviest thing it does — enough to drop frames on integrated
// graphics, which is exactly when the scroll feels like it is snatching. While
// the page is moving that quickly none of that animation can be read anyway, so
// the videos are parked for the duration and resume as soon as it settles.
//
// One listener and one flag for every VideoItem on the page, rather than each
// mounting its own: nine scroll listeners doing the same arithmetic would be
// part of the problem this is meant to solve.

const SUBSCRIBERS = new Set()
// px/sec. Ordinary reading scrolls well under this; it takes a deliberate
// flick or a held wheel to cross it, which is the case being optimised for.
const FAST_ABOVE = 1500
// How long after the last scroll event the page counts as settled. Long enough
// that a wheel's gaps between notches don't flicker the flag on and off.
const SETTLE_MS = 180

let isFast = false
let installed = false

function publish(next) {
  if (next === isFast) return
  isFast = next
  SUBSCRIBERS.forEach((fn) => fn(next))
}

function install() {
  if (installed || typeof window === 'undefined') return
  installed = true
  let lastY = window.scrollY
  let lastT = performance.now()
  let settleTimer = 0

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY
      const t = performance.now()
      const dt = t - lastT
      if (dt > 0 && Math.abs(y - lastY) / dt * 1000 > FAST_ABOVE) publish(true)
      lastY = y
      lastT = t
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => publish(false), SETTLE_MS)
    },
    { passive: true }
  )
}

function subscribe(onChange) {
  install()
  SUBSCRIBERS.add(onChange)
  return () => SUBSCRIBERS.delete(onChange)
}

// useSyncExternalStore rather than useState + useEffect: the flag lives outside
// React, and this is the API built for that — it also reads the current value
// at subscribe time, so a scroll that starts between render and subscribe is
// not missed.
export default function useFastScroll() {
  return useSyncExternalStore(
    subscribe,
    () => isFast,
    () => false
  )
}

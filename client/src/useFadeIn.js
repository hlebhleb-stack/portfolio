import { useEffect, useRef } from 'react'

export default function useFadeIn() {
  const pageRef = useRef(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const elements = root.querySelectorAll('.fade-in-up')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return pageRef
}

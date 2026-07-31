import { useState, useEffect } from 'react'
import { getDestinations } from '../services/api'
import { destinations as LOCAL } from '../data/destinations'

export function useDestinations() {
  const [destinations, setDestinations] = useState(LOCAL)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getDestinations()
      .then(data => { if (data?.length > 0) setDestinations(data) })
      .catch(() => setDestinations(LOCAL))
      .finally(() => setLoading(false))
  }, [])

  return { destinations, loading, error }
}

export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const fn = () => setY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return y
}

export function useInView(threshold = 0.15) {
  const [ref, setRef] = useState(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(ref)
    return () => obs.disconnect()
  }, [ref, threshold])
  return [setRef, inView]
}

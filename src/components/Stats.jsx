import { useEffect, useRef, useState } from 'react'
import './Stats.css'

function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    const num = parseFloat(target)
    if (isNaN(num)) { setCount(target); return }
    const isDecimal = String(target).includes('.')
    const start = performance.now()
    const raf = (ts) => {
      const progress = Math.min((ts - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = num * eased
      setCount(isDecimal ? current.toFixed(1) : Math.round(current))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [started, target, duration])
  return count
}

function StatItem({ stat, started }) {
  const count = useCountUp(stat.value, 1800, started)
  return (
    <div className="stat-item reveal">
      <span className="stat-value">
        {stat.prefix || ''}{count}{stat.suffix || ''}
      </span>
      <span className="stat-label">{stat.label}</span>
    </div>
  )
}

export default function Stats({ cfg }) {
  const stats = cfg.stats || []
  const ref   = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); io.disconnect() } },
      { threshold: 0.4 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  if (!stats.length) return null

  return (
    <section className="stats-section" ref={ref}>
      <div className="container stats__grid stagger">
        {stats.map((s, i) => <StatItem key={i} stat={s} started={started} />)}
      </div>
    </section>
  )
}

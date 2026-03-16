'use client'

import { useEffect, useState } from 'react'

interface HeroStatsProps {
  totalPostings: number
  avgFs: number
  avgUj: number
  avgTools: number
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 60
    const stepValue = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}</>
}

function fsColor(score: number) {
  if (score >= 60) return '#E24B4A'
  if (score >= 40) return '#EF9F27'
  return '#1D9E75'
}

function ujColor(score: number) {
  if (score >= 70) return '#E24B4A'
  if (score >= 55) return '#EF9F27'
  return '#1D9E75'
}

export function HeroStats({ totalPostings, avgFs, avgUj, avgTools }: HeroStatsProps) {
  const metrics = [
    {
      label: 'Postings Analyzed',
      rawValue: totalPostings,
      decimals: 0,
      suffix: '',
      sub: 'RevOps job postings',
      color: '#E8653A',
    },
    {
      label: 'Avg Franken-Stack',
      rawValue: avgFs,
      decimals: 1,
      suffix: '/100',
      sub: 'Tool complexity risk',
      color: fsColor(avgFs),
    },
    {
      label: 'Avg Unicorn JD',
      rawValue: avgUj,
      decimals: 1,
      suffix: '/100',
      sub: 'Requirement overload',
      color: ujColor(avgUj),
    },
    {
      label: 'Avg Tools / Role',
      rawValue: avgTools,
      decimals: 1,
      suffix: '',
      sub: 'Distinct tools required',
      color: '#1D9E75',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="card p-6 fade-up"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <p className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: '#8A8580', letterSpacing: '0.08em' }}>
            {m.label}
          </p>
          <p className="text-4xl font-semibold mb-1" style={{ color: m.color, fontFamily: 'var(--font-instrument-serif)' }}>
            <AnimatedNumber value={m.rawValue} decimals={m.decimals} />
            {m.suffix && <span className="text-xl ml-1" style={{ color: '#5A5550' }}>{m.suffix}</span>}
          </p>
          <p className="text-xs" style={{ color: '#5A5550' }}>{m.sub}</p>
        </div>
      ))}
    </div>
  )
}

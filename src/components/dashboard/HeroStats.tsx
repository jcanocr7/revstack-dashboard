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
      value: <AnimatedNumber value={totalPostings} />,
      suffix: '',
      sub: 'RevOps job postings',
      color: '#E8653A',
    },
    {
      label: 'Avg Franken-Stack Score',
      value: <AnimatedNumber value={avgFs} decimals={1} />,
      suffix: '/100',
      sub: 'Tool complexity risk',
      color: fsColor(avgFs),
    },
    {
      label: 'Avg Unicorn JD Score',
      value: <AnimatedNumber value={avgUj} decimals={1} />,
      suffix: '/100',
      sub: 'Requirement overload',
      color: ujColor(avgUj),
    },
    {
      label: 'Avg Tools per Role',
      value: <AnimatedNumber value={avgTools} decimals={1} />,
      suffix: '',
      sub: 'Distinct tools required',
      color: '#1D9E75',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-card p-6"
          style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: '#9CA3AF' }}>
            {m.label}
          </p>
          <p className="text-4xl font-semibold mb-1" style={{ color: m.color, fontFamily: 'var(--font-instrument-serif)' }}>
            <AnimatedNumber value={m.label === 'Postings Analyzed' ? totalPostings : m.label === 'Avg Franken-Stack Score' ? avgFs : m.label === 'Avg Unicorn JD Score' ? avgUj : avgTools} decimals={m.label === 'Postings Analyzed' ? 0 : 1} />
            <span className="text-xl ml-1" style={{ color: '#9CA3AF' }}>{m.suffix}</span>
          </p>
          <p className="text-xs" style={{ color: '#6B7280' }}>{m.sub}</p>
        </div>
      ))}
    </div>
  )
}

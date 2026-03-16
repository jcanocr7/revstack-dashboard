'use client'

import { useState } from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

interface TreemapLeaf {
  name: string
  size: number
  fs: number
  uj: number
  tools: number
  stage?: string
}

interface TreemapGroup {
  name: string
  children: TreemapLeaf[]
}

type ColorMetric = 'fs' | 'uj' | 'tools'

function scoreToColor(score: number, metric: ColorMetric): string {
  if (metric === 'tools') {
    // 1-3: teal, 4-6: orange, 7+: red
    if (score <= 3) return '#1D9E75'
    if (score <= 6) return '#EF9F27'
    return '#E24B4A'
  }
  // For fs and uj: green→yellow→red
  if (score <= 30) return '#1D9E75'
  if (score <= 50) {
    const t = (score - 30) / 20
    const r = Math.round(30 + t * 209)
    const g = Math.round(158 + t * 1)
    const b = Math.round(117 - t * 78)
    return `rgb(${r},${g},${b})`
  }
  if (score <= 70) {
    const t = (score - 50) / 20
    const r = Math.round(239 - t * 13)
    const g = Math.round(159 - t * 84)
    const b = Math.round(39 + t * 35)
    return `rgb(${r},${g},${b})`
  }
  return '#E24B4A'
}

interface CustomContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  fs?: number
  uj?: number
  tools?: number
  colorMetric?: ColorMetric
}

function CustomContent({ x = 0, y = 0, width = 0, height = 0, name, fs = 0, uj = 0, tools = 0, colorMetric = 'fs' }: CustomContentProps) {
  const score = colorMetric === 'fs' ? fs : colorMetric === 'uj' ? uj : tools
  const bg = scoreToColor(score, colorMetric)
  const showLabel = width > 50 && height > 30

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        style={{ fill: bg, opacity: 0.85, stroke: '#0A0A0A', strokeWidth: 2, rx: 4 }}
        rx={4}
      />
      {showLabel && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (height > 50 ? 8 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fill: '#F5F0EB', fontSize: Math.min(12, width / 6), fontWeight: 600, fontFamily: 'var(--font-dm-sans)', pointerEvents: 'none' }}
          >
            {name}
          </text>
          {height > 50 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'var(--font-dm-sans)', pointerEvents: 'none' }}
            >
              {colorMetric === 'tools' ? `${tools} tools` : colorMetric === 'fs' ? `FS: ${fs}` : `UJ: ${uj}`}
            </text>
          )}
        </>
      )}
    </g>
  )
}

interface TooltipPayload {
  name?: string
  fs?: number
  uj?: number
  tools?: number
  size?: number
  stage?: string
  value?: number
  payload?: {
    name?: string
    fs?: number
    uj?: number
    tools?: number
    size?: number
    stage?: string
    root?: { name?: string }
  }
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload
    if (!d || !d.name) return null
    return (
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 180 }}>
        <p style={{ color: '#F5F0EB', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{d.name}</p>
        {d.root?.name && <p style={{ color: '#8A8580', fontSize: 11, marginBottom: 6 }}>{d.root.name}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: '#5A5550', fontSize: 12 }}>Postings</span>
            <span style={{ color: '#E8653A', fontSize: 12, fontWeight: 600 }}>{d.size}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: '#5A5550', fontSize: 12 }}>Franken-Stack</span>
            <span style={{ color: '#F5F0EB', fontSize: 12 }}>{d.fs}/100</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: '#5A5550', fontSize: 12 }}>Unicorn JD</span>
            <span style={{ color: '#F5F0EB', fontSize: 12 }}>{d.uj}/100</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: '#5A5550', fontSize: 12 }}>Avg Tools</span>
            <span style={{ color: '#1D9E75', fontSize: 12 }}>{d.tools}</span>
          </div>
          {d.stage && d.stage !== 'unknown' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ color: '#5A5550', fontSize: 12 }}>Stage</span>
              <span style={{ color: '#8A8580', fontSize: 12 }}>{d.stage.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const TOGGLE_OPTIONS: { key: ColorMetric; label: string }[] = [
  { key: 'fs', label: 'Franken-Stack' },
  { key: 'uj', label: 'Unicorn JD' },
  { key: 'tools', label: 'Tool Count' },
]

export function JobTreemap({ data }: { data: TreemapGroup[] }) {
  const [metric, setMetric] = useState<ColorMetric>('fs')

  // Flatten for Recharts Treemap — it needs a flat children array at root level
  const treemapData = data.map((group) => ({
    name: group.name,
    children: group.children.map((c) => ({
      ...c,
      value: c.size,
      root: { name: group.name },
    })),
  }))

  return (
    <div className="card p-6 md:p-8" style={{ position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,101,58,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'pulseGlow 4s ease-in-out infinite',
      }} />

      <span className="section-label">Market Map</span>
      <h2 className="section-title">Company <em>Treemap</em></h2>
      <p className="text-sm mb-6" style={{ color: '#8A8580' }}>
        Area = posting volume · Color = selected score metric · Hover for details
      </p>

      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOGGLE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setMetric(opt.key)}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: 6,
              border: metric === opt.key ? '1px solid rgba(232,101,58,0.3)' : '1px solid rgba(255,255,255,0.06)',
              background: metric === opt.key ? 'rgba(232,101,58,0.08)' : 'rgba(255,255,255,0.03)',
              color: metric === opt.key ? '#E8653A' : '#5A5550',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            {opt.label}
          </button>
        ))}

        {/* Color legend */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#1D9E75', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: '#5A5550' }}>Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#EF9F27', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: '#5A5550' }}>Mid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#E24B4A', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: '#5A5550' }}>High</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <Treemap
          data={treemapData}
          dataKey="value"
          aspectRatio={4 / 3}
          content={
            <CustomContent colorMetric={metric} />
          }
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}

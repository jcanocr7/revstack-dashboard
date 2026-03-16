'use client'

import { useState } from 'react'

interface CompanyData {
  company_name: string
  company_industry?: string | null
  company_stage?: string | null
  posting_count: number
  avg_fs: number
  avg_uj: number
  avg_tools: number
}

function FsTierDot({ score }: { score: number }) {
  const color = score >= 60 ? '#E24B4A' : score >= 45 ? '#EF9F27' : '#1D9E75'
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span style={{ color: '#F5F0EB' }}>{score.toFixed(0)}</span>
    </div>
  )
}

function UjTierDot({ score }: { score: number }) {
  const color = score >= 70 ? '#D4537E' : score >= 60 ? '#7F77DD' : '#85B7EB'
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span style={{ color: '#F5F0EB' }}>{score.toFixed(0)}</span>
    </div>
  )
}

function StageBadge({ stage }: { stage: string }) {
  const label = stage.replace(/_/g, ' ').toUpperCase()
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      color: '#E8653A',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      background: 'rgba(232,101,58,0.06)',
      border: '1px solid rgba(232,101,58,0.15)',
      borderRadius: 4,
      padding: '1px 5px',
      marginLeft: 6,
    }}>
      {label}
    </span>
  )
}

export function CompanyTable({ companies }: { companies: CompanyData[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="card p-6 md:p-8">
      <span className="section-label">Market Leaders</span>
      <h2 className="section-title">Company <em>Leaderboard</em></h2>
      <p className="text-sm mb-8" style={{ color: '#8A8580' }}>Top companies by RevOps posting volume</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#', 'Company', 'Industry', 'Postings', 'Avg FS', 'Avg UJ', 'Avg Tools'].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left font-medium"
                  style={{ color: '#5A5550', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr
                key={c.company_name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: hovered === i ? 'rgba(232,101,58,0.03)' : 'transparent',
                  transform: hovered === i ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
              >
                <td className="py-3 pr-4">
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: 'rgba(232,101,58,0.06)',
                    color: '#E8653A',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span style={{ color: '#F5F0EB', fontWeight: 500 }}>{c.company_name}</span>
                  {c.company_stage && c.company_stage !== 'unknown' && (
                    <StageBadge stage={c.company_stage} />
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span style={{ color: '#8A8580' }}>{c.company_industry || '—'}</span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ background: 'rgba(232,101,58,0.12)', color: '#E8653A' }}
                  >
                    {c.posting_count}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <FsTierDot score={c.avg_fs} />
                </td>
                <td className="py-3 pr-4">
                  <UjTierDot score={c.avg_uj} />
                </td>
                <td className="py-3">
                  <span style={{ color: '#1D9E75' }}>{c.avg_tools.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

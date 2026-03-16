'use client'

import { useState } from 'react'

interface CompanyData {
  company_name: string
  company_industry?: string
  company_stage?: string
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
      <span style={{ color: '#F5F5F5' }}>{score.toFixed(0)}</span>
    </div>
  )
}

function UjTierDot({ score }: { score: number }) {
  const color = score >= 70 ? '#D4537E' : score >= 60 ? '#7F77DD' : '#85B7EB'
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span style={{ color: '#F5F5F5' }}>{score.toFixed(0)}</span>
    </div>
  )
}

export function CompanyTable({ companies }: { companies: CompanyData[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div
      className="rounded-card p-6"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
        Company Leaderboard
      </h2>
      <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>Top companies by RevOps posting volume</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Company', 'Industry', 'Postings', 'Avg FS', 'Avg UJ', 'Avg Tools'].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left font-medium"
                  style={{ color: '#6B7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}
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
                  background: hovered === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
              >
                <td className="py-3 pr-4">
                  <span style={{ color: '#F5F5F5', fontWeight: 500 }}>{c.company_name}</span>
                </td>
                <td className="py-3 pr-4">
                  <span style={{ color: '#9CA3AF' }}>{c.company_industry || '—'}</span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ background: 'rgba(232,101,58,0.15)', color: '#E8653A' }}
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

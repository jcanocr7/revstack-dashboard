'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

interface RegionData {
  region: string
  posting_count: number
  avg_fs: number
  avg_uj: number
  avg_tools: number
  avg_salary_max?: number
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', minWidth: 160 }}>
        <p style={{ color: '#F5F5F5', fontSize: 13, marginBottom: 6 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
            {p.name}: {p.name === 'Avg Tools ×10' ? (p.value / 10).toFixed(1) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function RegionalChart({ regions }: { regions: RegionData[] }) {
  const data = regions.map((r) => ({
    name: `${r.region} (${r.posting_count})`,
    'Franken-Stack': Math.round(r.avg_fs),
    'Unicorn JD': Math.round(r.avg_uj),
    'Avg Tools ×10': Math.round(r.avg_tools * 10),
  }))

  return (
    <div
      className="rounded-card p-6"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
        Regional Comparison
      </h2>
      <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
        Avg scores by region — tools scaled ×10 for readability
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#9CA3AF' }}
            formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value}</span>}
          />
          <Bar dataKey="Franken-Stack" fill="#E8653A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Unicorn JD" fill="#7F77DD" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Avg Tools ×10" fill="#1D9E75" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

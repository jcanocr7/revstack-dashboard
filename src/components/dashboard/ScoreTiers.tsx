'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const FS_COLORS: Record<string, string> = {
  high_risk: '#E24B4A',
  moderate_risk: '#EF9F27',
  low_risk: '#1D9E75',
  minimal: '#3a3a3a',
}

const UJ_COLORS: Record<string, string> = {
  unicorn: '#D4537E',
  stretched: '#7F77DD',
  reasonable: '#85B7EB',
  focused: '#3a3a3a',
}

const FS_LABELS: Record<string, string> = {
  high_risk: 'High Risk',
  moderate_risk: 'Moderate Risk',
  low_risk: 'Low Risk',
  minimal: 'Minimal',
}

const UJ_LABELS: Record<string, string> = {
  unicorn: 'Unicorn',
  stretched: 'Stretched',
  reasonable: 'Reasonable',
  focused: 'Focused',
}

interface TierData {
  fs: Record<string, number>
  uj: Record<string, number>
}

function DonutChart({
  data,
  colors,
  labels,
  title,
  label,
}: {
  data: Record<string, number>
  colors: Record<string, string>
  labels: Record<string, string>
  title: string
  label: string
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: labels[key] || key,
    key,
    value,
    pct: ((value / total) * 100).toFixed(1),
  }))

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { pct: string } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      return (
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <p style={{ color: '#F5F0EB', fontSize: 13 }}>{item.name}</p>
          <p style={{ color: '#8A8580', fontSize: 12 }}>{item.value} postings ({item.payload.pct}%)</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <span className="section-label">{label}</span>
      <h3 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>
        {title.split(' ')[0]} <em>{title.split(' ').slice(1).join(' ')}</em>
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={colors[entry.key]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[item.key] }} />
              <span style={{ color: '#8A8580' }}>{item.name}</span>
            </div>
            <span style={{ color: '#F5F0EB' }}>{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ScoreTiers({ tiers }: { tiers: TierData }) {
  return (
    <div className="card p-6 md:p-8">
      <span className="section-label">Risk Analysis</span>
      <h2 className="section-title">Score Tier <em>Distributions</em></h2>
      <p className="text-sm mb-8" style={{ color: '#8A8580' }}>
        How postings break down by complexity and requirement tiers
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <DonutChart data={tiers.fs} colors={FS_COLORS} labels={FS_LABELS} title="Franken-Stack Risk" label="STACK COMPLEXITY" />
        <DonutChart data={tiers.uj} colors={UJ_COLORS} labels={UJ_LABELS} title="Unicorn JD Index" label="REQUIREMENT LOAD" />
      </div>
    </div>
  )
}

'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const FS_COLORS: Record<string, string> = {
  high_risk: '#E24B4A',
  moderate_risk: '#EF9F27',
  low_risk: '#1D9E75',
  minimal: '#4B4B4B',
}

const UJ_COLORS: Record<string, string> = {
  unicorn: '#D4537E',
  stretched: '#7F77DD',
  reasonable: '#85B7EB',
  focused: '#4B4B4B',
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
}: {
  data: Record<string, number>
  colors: Record<string, string>
  labels: Record<string, string>
  title: string
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
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
          <p style={{ color: '#F5F5F5', fontSize: 13 }}>{item.name}</p>
          <p style={{ color: '#9CA3AF', fontSize: 12 }}>{item.value} postings ({item.payload.pct}%)</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <h3 className="text-lg mb-4 font-medium" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
        {title}
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
              <span style={{ color: '#9CA3AF' }}>{item.name}</span>
            </div>
            <span style={{ color: '#F5F5F5' }}>{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ScoreTiers({ tiers }: { tiers: TierData }) {
  return (
    <div
      className="rounded-card p-6"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
        Score Tier Distributions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DonutChart data={tiers.fs} colors={FS_COLORS} labels={FS_LABELS} title="Franken-Stack Risk" />
        <DonutChart data={tiers.uj} colors={UJ_COLORS} labels={UJ_LABELS} title="Unicorn JD Index" />
      </div>
    </div>
  )
}

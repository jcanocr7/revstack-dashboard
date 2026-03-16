'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

interface RemoteData {
  remote_policy: string
  posting_count: number
}

interface SeniorityData {
  seniority: string
  posting_count: number
  avg_fs: number
  avg_uj: number
}

const REMOTE_COLORS: Record<string, string> = {
  hybrid: '#E8653A',
  remote: '#1D9E75',
  onsite: '#7F77DD',
  unknown: '#4B4B4B',
}

const REMOTE_LABELS: Record<string, string> = {
  hybrid: 'Hybrid',
  remote: 'Remote',
  onsite: 'On-site',
  unknown: 'Unknown',
}

const SENIORITY_ORDER = ['junior', 'mid', 'senior', 'lead', 'head', 'vp']

const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ color: '#F5F5F5', fontSize: 13 }}>{payload[0].name}</p>
        <p style={{ color: '#9CA3AF', fontSize: 12 }}>{payload[0].value} postings</p>
      </div>
    )
  }
  return null
}

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ color: '#F5F5F5', fontSize: 13, textTransform: 'capitalize' }}>{label}</p>
        <p style={{ color: '#9CA3AF', fontSize: 12 }}>{payload[0].value} postings</p>
      </div>
    )
  }
  return null
}

export function PolicySeniority({ remote, seniority }: { remote: RemoteData[]; seniority: SeniorityData[] }) {
  const total = remote.reduce((a, b) => a + b.posting_count, 0)
  const remoteChart = remote.map((r) => ({
    name: REMOTE_LABELS[r.remote_policy] || r.remote_policy,
    key: r.remote_policy,
    value: r.posting_count,
    pct: ((r.posting_count / total) * 100).toFixed(1),
  }))

  const seniorityChart = [...seniority].sort(
    (a, b) => SENIORITY_ORDER.indexOf(a.seniority) - SENIORITY_ORDER.indexOf(b.seniority)
  )

  return (
    <div
      className="rounded-card p-6"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Remote Policy */}
        <div>
          <h3 className="text-lg mb-4 font-medium" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
            Remote Policy
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={remoteChart} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                {remoteChart.map((entry) => (
                  <Cell key={entry.key} fill={REMOTE_COLORS[entry.key] || '#4B4B4B'} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {remoteChart.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: REMOTE_COLORS[item.key] || '#4B4B4B' }} />
                  <span style={{ color: '#9CA3AF' }}>{item.name}</span>
                </div>
                <span style={{ color: '#F5F5F5' }}>{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seniority Distribution */}
        <div>
          <h3 className="text-lg mb-4 font-medium" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
            Seniority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={seniorityChart} layout="vertical" barCategoryGap="25%">
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="seniority"
                tick={{ fill: '#9CA3AF', fontSize: 12, textTransform: 'capitalize' }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="posting_count" fill="#E8653A" radius={[0, 4, 4, 0]} name="Postings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

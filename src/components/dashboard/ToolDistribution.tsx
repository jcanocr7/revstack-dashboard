'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const MOCK_TOOL_DATA = [
  { tools: '1', count: 28 },
  { tools: '2', count: 65 },
  { tools: '3', count: 102 },
  { tools: '4', count: 88 },
  { tools: '5', count: 54 },
  { tools: '6', count: 32 },
  { tools: '7', count: 18 },
  { tools: '8', count: 7 },
  { tools: '9', count: 3 },
  { tools: '10+', count: 2 },
]

interface ToolDistRow {
  tool_count_bucket: string
  count: number
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <p style={{ color: '#8A8580', fontSize: 12 }}>{label} tool{label !== '1' ? 's' : ''}</p>
        <p style={{ color: '#E8653A', fontSize: 13 }}>{payload[0].value} postings</p>
      </div>
    )
  }
  return null
}

export function ToolDistribution({ liveData }: { liveData?: ToolDistRow[] }) {
  const data = liveData && liveData.length > 0
    ? liveData.map((r) => ({ tools: r.tool_count_bucket, count: Number(r.count) }))
    : MOCK_TOOL_DATA

  const max = Math.max(...data.map((d) => d.count))

  return (
    <div className="card p-6 md:p-8">
      <span className="section-label">Tool Analysis</span>
      <h2 className="section-title">Tool Count <em>Distribution</em></h2>
      <p className="text-sm mb-8" style={{ color: '#8A8580' }}>
        Number of distinct tools required per role
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="tools" tick={{ fill: '#8A8580', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8A8580', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.tools}
                fill={entry.count === max ? '#E8653A' : `rgba(232,101,58,${0.25 + (entry.count / max) * 0.55})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

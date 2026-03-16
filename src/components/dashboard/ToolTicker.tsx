'use client'

const TOOLS = [
  'Salesforce', 'HubSpot', 'Clay', 'Apollo', 'Outreach', 'Gong',
  'Claude', 'Cursor', 'n8n', 'Segment', 'LeanData', 'Looker',
  'Marketo', 'Pardot', 'ZoomInfo', 'dbt', 'Snowflake', 'Power BI',
  'Salesloft', 'Clari', 'Chorus', '6sense', 'Demandbase', 'Drift',
]

function Sep() {
  return (
    <span style={{
      display: 'inline-block',
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: '#E8653A',
      opacity: 0.5,
      margin: '0 16px',
      verticalAlign: 'middle',
    }} />
  )
}

export function ToolTicker() {
  // Duplicate items for seamless loop
  const items = [...TOOLS, ...TOOLS]

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '14px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      background: '#0A0A0A',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        animation: 'ticker 40s linear infinite',
      }}>
        {items.map((tool, i) => (
          <span key={`${tool}-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{
              fontSize: 13,
              color: '#5A5550',
              padding: '0 24px',
              fontFamily: 'var(--font-dm-sans)',
              letterSpacing: '0.01em',
            }}>
              {tool}
            </span>
            <Sep />
          </span>
        ))}
      </div>
    </div>
  )
}

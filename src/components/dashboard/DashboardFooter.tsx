'use client'

export function DashboardFooter({
  lastUpdated,
  totalPostings,
  regionCount,
}: {
  lastUpdated: string
  totalPostings: number
  regionCount: number
}) {
  const date = new Date(lastUpdated)
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <footer
      style={{
        marginTop: 64,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 0',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#E8653A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#0A0A0A',
              fontFamily: 'var(--font-dm-sans)',
            }}>
              R
            </div>
            <span style={{ color: '#F5F0EB', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-dm-sans)' }}>
              RevStack
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#5A5550' }}>
            © 2026 RevStack. Built in Berlin.
          </p>
          <p style={{ fontSize: 12, color: '#5A5550', marginTop: 4 }}>
            Data from {totalPostings.toLocaleString()} RevOps postings across {regionCount} regions · Updated {formatted}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {['LinkedIn', 'X / Twitter', 'Substack'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 13,
                color: '#5A5550',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8A8580')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5A5550')}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

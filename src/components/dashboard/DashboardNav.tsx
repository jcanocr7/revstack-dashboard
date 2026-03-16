'use client'

export function DashboardNav() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(10,10,10,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '20px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          flexShrink: 0,
        }}>
          R
        </div>
        <span style={{ color: '#F5F0EB', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-dm-sans)', letterSpacing: '-0.01em' }}>
          RevStack
        </span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', gap: 32 }} className="hidden md:flex">
          {['Dashboard', 'Methodology', 'Substack'].map((item) => (
            <a key={item} href="#" style={{ fontSize: 14, color: '#8A8580', textDecoration: 'none', transition: 'color 0.3s ease', fontFamily: 'var(--font-dm-sans)' }}
               onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F0EB')}
               onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8580')}>
              {item}
            </a>
          ))}
        </div>
        <a href="#" style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#0A0A0A',
          background: '#E8653A',
          padding: '8px 16px',
          borderRadius: 6,
          textDecoration: 'none',
          fontFamily: 'var(--font-dm-sans)',
          transition: 'opacity 0.3s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
          Get the Report
        </a>
      </nav>
    </header>
  )
}

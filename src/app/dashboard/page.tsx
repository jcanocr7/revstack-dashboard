import { HeroStats } from '@/components/dashboard/HeroStats'
import { ScoreTiers } from '@/components/dashboard/ScoreTiers'
import { RegionalChart } from '@/components/dashboard/RegionalChart'
import { PolicySeniority } from '@/components/dashboard/PolicySeniority'
import { ToolDistribution } from '@/components/dashboard/ToolDistribution'
import { CompanyTable } from '@/components/dashboard/CompanyTable'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { MOCK_DATA } from '@/lib/mockData'

async function getDashboardData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('API returned non-OK')
    return res.json()
  } catch (err) {
    console.error('Failed to fetch live data, falling back to mock:', err)
    return MOCK_DATA
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const { overview, regions, tiers, seniority, remote, companies, toolDistribution } = data

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-10 px-6 py-4"
        style={{
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-xl"
              style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}
            >
              RevStack
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(232,101,58,0.15)', color: '#E8653A' }}
            >
              Intelligence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1D9E75' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Live data</span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Page heading */}
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}
          >
            RevOps Job Market Intelligence
          </h1>
          <p className="text-base max-w-2xl" style={{ color: '#9CA3AF' }}>
            Real-time analysis of tool complexity, requirement overload, and hiring patterns across{' '}
            {overview.total_postings.toLocaleString()} RevOps postings worldwide.
          </p>
        </div>

        {/* 1. Hero stats */}
        <HeroStats
          totalPostings={overview.total_postings}
          avgFs={overview.avg_fs}
          avgUj={overview.avg_uj}
          avgTools={overview.avg_tools}
        />

        {/* 2. Score tier distributions */}
        <ScoreTiers tiers={tiers} />

        {/* 3. Regional comparison */}
        <RegionalChart regions={regions} />

        {/* 4. Remote policy + seniority */}
        <PolicySeniority remote={remote} seniority={seniority} />

        {/* 5. Tool count distribution */}
        <ToolDistribution liveData={toolDistribution} />

        {/* 6. Company leaderboard */}
        <CompanyTable companies={companies} />

        {/* 7. Footer */}
        <DashboardFooter
          lastUpdated={overview.last_updated}
          totalPostings={overview.total_postings}
          regionCount={regions.length}
        />
      </div>
    </main>
  )
}

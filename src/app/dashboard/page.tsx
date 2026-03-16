import { supabase } from '@/lib/supabase'
import { MOCK_DATA, type DashboardData } from '@/lib/mockData'
import { HeroStats } from '@/components/dashboard/HeroStats'
import { ScoreTiers } from '@/components/dashboard/ScoreTiers'
import { RegionalChart } from '@/components/dashboard/RegionalChart'
import { PolicySeniority } from '@/components/dashboard/PolicySeniority'
import { ToolDistribution } from '@/components/dashboard/ToolDistribution'
import { CompanyTable } from '@/components/dashboard/CompanyTable'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'

async function getDashboardData(): Promise<DashboardData> {
  try {
    const [
      overviewRes,
      regionsRes,
      seniorityRes,
      remoteRes,
      companiesRes,
      tiersRes,
      toolDistRes,
    ] = await Promise.all([
      supabase.from('mv_dashboard_overview').select('*').single(),
      supabase.from('mv_dashboard_regions').select('*'),
      supabase.from('mv_dashboard_seniority').select('*'),
      supabase.from('mv_dashboard_remote').select('*'),
      supabase.from('mv_dashboard_companies').select('*').order('posting_count', { ascending: false }).limit(15),
      supabase.from('mv_dashboard_score_tiers').select('*'),
      supabase.rpc('get_tool_distribution'),
    ])

    if (!overviewRes.data) throw new Error('No overview data from Supabase')

    // Aggregate score_tiers cross-tab into fs and uj totals
    const tierRows = tiersRes.data || []
    const fsTiers: Record<string, number> = {}
    const ujTiers: Record<string, number> = {}
    for (const row of tierRows) {
      fsTiers[row.fs_tier] = (fsTiers[row.fs_tier] || 0) + Number(row.count)
      ujTiers[row.uj_tier] = (ujTiers[row.uj_tier] || 0) + Number(row.count)
    }

    // Aggregate remote by policy (view has per-region rows)
    const remoteRows = remoteRes.data || []
    const remoteTotals: Record<string, number> = {}
    for (const row of remoteRows) {
      remoteTotals[row.remote_policy] = (remoteTotals[row.remote_policy] || 0) + Number(row.posting_count)
    }

    return {
      overview: {
        ...overviewRes.data,
        avg_fs: parseFloat(overviewRes.data.avg_fs),
        avg_uj: parseFloat(overviewRes.data.avg_uj),
        avg_tools: parseFloat(overviewRes.data.avg_tools),
        avg_skill_cats: parseFloat(overviewRes.data.avg_skill_cats),
      },
      regions: (regionsRes.data || []).map((r) => ({
        region: r.region,
        posting_count: r.posting_count,
        avg_fs: parseFloat(r.avg_fs),
        avg_uj: parseFloat(r.avg_uj),
        avg_tools: parseFloat(r.avg_tools),
        avg_salary_max: r.avg_salary_max ? parseFloat(r.avg_salary_max) : null,
      })),
      seniority: (seniorityRes.data || []).map((r) => ({
        seniority: r.seniority,
        posting_count: r.posting_count,
        avg_fs: parseFloat(r.avg_fs),
        avg_uj: parseFloat(r.avg_uj),
        avg_tools: parseFloat(r.avg_tools),
      })),
      remote: Object.entries(remoteTotals).map(([remote_policy, posting_count]) => ({
        remote_policy,
        posting_count,
      })),
      companies: (companiesRes.data || []).map((r) => ({
        company_name: r.company_name,
        company_industry: r.company_industry ?? null,
        company_stage: r.company_stage ?? null,
        posting_count: r.posting_count,
        avg_fs: parseFloat(r.avg_fs),
        avg_uj: parseFloat(r.avg_uj),
        avg_tools: parseFloat(r.avg_tools),
      })),
      tiers: { fs: fsTiers, uj: ujTiers },
      toolDistribution: (toolDistRes.data || []).map((r: { tool_count_bucket: string; count: number }) => ({
        tool_count_bucket: r.tool_count_bucket,
        count: Number(r.count),
      })),
    }
  } catch (err) {
    console.error('Supabase fetch failed, using mock data:', err)
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
            <span className="text-xl" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
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

        <HeroStats
          totalPostings={overview.total_postings}
          avgFs={overview.avg_fs}
          avgUj={overview.avg_uj}
          avgTools={overview.avg_tools}
        />
        <ScoreTiers tiers={tiers} />
        <RegionalChart regions={regions} />
        <PolicySeniority remote={remote} seniority={seniority} />
        <ToolDistribution liveData={toolDistribution} />
        <CompanyTable companies={companies} />
        <DashboardFooter
          lastUpdated={overview.last_updated}
          totalPostings={overview.total_postings}
          regionCount={regions.length}
        />
      </div>
    </main>
  )
}

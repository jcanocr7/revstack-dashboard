import { supabase } from '@/lib/supabase'
import { MOCK_DATA, TREEMAP_DATA, type DashboardData } from '@/lib/mockData'
import { HeroStats } from '@/components/dashboard/HeroStats'
import { JobTreemap } from '@/components/dashboard/JobTreemap'
import { ScoreTiers } from '@/components/dashboard/ScoreTiers'
import { RegionalChart } from '@/components/dashboard/RegionalChart'
import { PolicySeniority } from '@/components/dashboard/PolicySeniority'
import { ToolDistribution } from '@/components/dashboard/ToolDistribution'
import { CompanyTable } from '@/components/dashboard/CompanyTable'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { ToolTicker } from '@/components/dashboard/ToolTicker'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

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

    const tierRows = tiersRes.data || []
    const fsTiers: Record<string, number> = {}
    const ujTiers: Record<string, number> = {}
    for (const row of tierRows) {
      fsTiers[row.fs_tier] = (fsTiers[row.fs_tier] || 0) + Number(row.count)
      ujTiers[row.uj_tier] = (ujTiers[row.uj_tier] || 0) + Number(row.count)
    }

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
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* Nav */}
      <DashboardNav />

      {/* Tool Ticker */}
      <div style={{ paddingTop: 68 }}>
        <ToolTicker />
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 48px' }}>

        {/* Page header with ambient glow */}
        <div style={{ position: 'relative', marginBottom: 64 }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute',
            top: -100,
            right: -200,
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,101,58,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'pulseGlow 4s ease-in-out infinite',
          }} />

          <span className="fade-up" style={{ animationDelay: '0s', display: 'block', fontSize: 11, fontWeight: 500, color: '#E8653A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Live Intelligence
          </span>
          <h1 className="fade-up" style={{
            animationDelay: '0.1s',
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            fontWeight: 400,
            lineHeight: 1.12,
            letterSpacing: '-0.025em',
            color: '#F5F0EB',
            marginBottom: 20,
          }}>
            RevOps Job Market <em style={{ color: '#E8653A', fontStyle: 'italic' }}>Intelligence</em>
          </h1>
          <p className="fade-up" style={{
            animationDelay: '0.2s',
            fontSize: 18,
            color: '#8A8580',
            maxWidth: 560,
            lineHeight: 1.65,
            fontWeight: 300,
            marginBottom: 40,
          }}>
            Real-time analysis of tool complexity, requirement overload, and hiring patterns across {overview.total_postings.toLocaleString()} RevOps postings worldwide.
          </p>

          {/* Proof bar */}
          <div className="fade-up" style={{
            animationDelay: '0.3s',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 0,
          }}>
            {[
              { num: overview.total_postings.toLocaleString(), label: 'Postings analyzed' },
              { num: '4', label: 'Regions tracked' },
              { num: overview.avg_tools.toFixed(1), label: 'Avg tools per role' },
              { num: '€0', label: 'Vendor bias' },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '0 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#F5F0EB', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.2 }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: 12, color: '#5A5550', marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 1. Hero stats */}
          <HeroStats
            totalPostings={overview.total_postings}
            avgFs={overview.avg_fs}
            avgUj={overview.avg_uj}
            avgTools={overview.avg_tools}
          />

          {/* 2. Treemap — centerpiece */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,101,58,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <JobTreemap data={TREEMAP_DATA} />
          </div>

          {/* 3. Score tiers */}
          <ScoreTiers tiers={tiers} />

          {/* 4. Regional */}
          <RegionalChart regions={regions} />

          {/* 5. Remote + seniority */}
          <PolicySeniority remote={remote} seniority={seniority} />

          {/* 6. Tool distribution */}
          <ToolDistribution liveData={toolDistribution} />

          {/* 7. Company leaderboard */}
          <CompanyTable companies={companies} />

          {/* Footer */}
          <DashboardFooter
            lastUpdated={overview.last_updated}
            totalPostings={overview.total_postings}
            regionCount={regions.length}
          />
        </div>
      </div>
    </main>
  )
}

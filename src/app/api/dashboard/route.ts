import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
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
    ]);

    const errors = [overviewRes, regionsRes, seniorityRes, remoteRes, companiesRes, tiersRes].filter(r => r.error);
    if (errors.length > 0) {
      console.error('Supabase errors:', errors.map(e => e.error));
    }

    // Aggregate score_tiers cross-tab into fs and uj totals
    const tierRows = tiersRes.data || [];
    const fsTiers: Record<string, number> = {};
    const ujTiers: Record<string, number> = {};
    for (const row of tierRows) {
      fsTiers[row.fs_tier] = (fsTiers[row.fs_tier] || 0) + Number(row.count);
      ujTiers[row.uj_tier] = (ujTiers[row.uj_tier] || 0) + Number(row.count);
    }

    // Aggregate remote by policy (view has per-region rows)
    const remoteRows = remoteRes.data || [];
    const remoteTotals: Record<string, number> = {};
    for (const row of remoteRows) {
      remoteTotals[row.remote_policy] = (remoteTotals[row.remote_policy] || 0) + Number(row.posting_count);
    }
    const remoteAggregated = Object.entries(remoteTotals).map(([remote_policy, posting_count]) => ({
      remote_policy,
      posting_count,
    }));

    // Parse Postgres numeric strings → JS numbers
    const overview = overviewRes.data
      ? {
          ...overviewRes.data,
          avg_fs: parseFloat(overviewRes.data.avg_fs),
          avg_uj: parseFloat(overviewRes.data.avg_uj),
          avg_tools: parseFloat(overviewRes.data.avg_tools),
          avg_skill_cats: parseFloat(overviewRes.data.avg_skill_cats),
        }
      : null;

    const regions = (regionsRes.data || []).map((r: Record<string, unknown>) => ({
      ...r,
      avg_fs: parseFloat(r.avg_fs as string),
      avg_uj: parseFloat(r.avg_uj as string),
      avg_tools: parseFloat(r.avg_tools as string),
      avg_salary_max: r.avg_salary_max ? parseFloat(r.avg_salary_max as string) : null,
    }));

    const seniority = (seniorityRes.data || []).map((r: Record<string, unknown>) => ({
      ...r,
      avg_fs: parseFloat(r.avg_fs as string),
      avg_uj: parseFloat(r.avg_uj as string),
      avg_tools: parseFloat(r.avg_tools as string),
    }));

    const companies = (companiesRes.data || []).map((r: Record<string, unknown>) => ({
      ...r,
      avg_fs: parseFloat(r.avg_fs as string),
      avg_uj: parseFloat(r.avg_uj as string),
      avg_tools: parseFloat(r.avg_tools as string),
    }));

    return NextResponse.json({
      overview,
      regions,
      seniority,
      remote: remoteAggregated,
      companies,
      tiers: { fs: fsTiers, uj: ujTiers },
      toolDistribution: toolDistRes.data || [],
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server'
import { MOCK_DATA } from '@/lib/mockData'

// Uncomment when Supabase credentials are available:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// )

export async function GET() {
  // TODO: Replace with live Supabase queries when .env.local is set:
  // const [overview, regions, tiers, seniority, remote, companies] = await Promise.all([
  //   supabase.from('mv_dashboard_overview').select('*').single(),
  //   supabase.from('mv_dashboard_regions').select('*'),
  //   supabase.from('mv_dashboard_score_tiers').select('*'),
  //   supabase.from('mv_dashboard_seniority').select('*'),
  //   supabase.from('mv_dashboard_remote').select('*'),
  //   supabase.from('mv_dashboard_companies').select('*').limit(15),
  // ])
  // return NextResponse.json({
  //   overview: overview.data,
  //   regions: regions.data,
  //   tiers: tiers.data,
  //   seniority: seniority.data,
  //   remote: remote.data,
  //   companies: companies.data,
  // }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })

  return NextResponse.json(MOCK_DATA, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}

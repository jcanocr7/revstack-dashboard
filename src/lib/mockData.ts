export interface Overview {
  total_postings: number
  avg_fs: number
  avg_uj: number
  avg_tools: number
  avg_skill_cats: number
  high_risk_count: number
  unicorn_count: number
  last_updated: string
}

export interface RegionData {
  region: string
  posting_count: number
  avg_fs: number
  avg_uj: number
  avg_tools: number
  avg_salary_max?: number | null
}

export interface SeniorityData {
  seniority: string
  posting_count: number
  avg_fs: number
  avg_uj: number
  avg_tools: number
}

export interface RemoteData {
  remote_policy: string
  posting_count: number
}

export interface CompanyData {
  company_name: string
  company_industry?: string | null
  company_stage?: string | null
  posting_count: number
  avg_fs: number
  avg_uj: number
  avg_tools: number
}

export interface TierCounts {
  fs: Record<string, number>
  uj: Record<string, number>
}

export interface ToolDistRow {
  tool_count_bucket: string
  count: number
}

export interface DashboardData {
  overview: Overview
  regions: RegionData[]
  seniority: SeniorityData[]
  remote: RemoteData[]
  companies: CompanyData[]
  tiers: TierCounts
  toolDistribution: ToolDistRow[]
}

export const MOCK_DATA: DashboardData = {
  overview: {
    total_postings: 399,
    avg_fs: 53.2,
    avg_uj: 64.5,
    avg_tools: 3.2,
    avg_skill_cats: 2.3,
    high_risk_count: 5,
    unicorn_count: 3,
    last_updated: '2026-03-13T12:46:01Z',
  },
  regions: [
    { region: 'US', posting_count: 244, avg_fs: 55.8, avg_uj: 66.3, avg_tools: 2.9, avg_salary_max: 164550 },
    { region: 'EU Remote', posting_count: 48, avg_fs: 42.0, avg_uj: 56.4, avg_tools: 3.5, avg_salary_max: 78178 },
    { region: 'UK', posting_count: 41, avg_fs: 56.8, avg_uj: 67.8, avg_tools: 4.6, avg_salary_max: 59125 },
    { region: 'DACH', posting_count: 38, avg_fs: 48.8, avg_uj: 62.1, avg_tools: 3.1, avg_salary_max: 90000 },
    { region: 'Global Remote', posting_count: 12, avg_fs: 58.3, avg_uj: 68.8, avg_tools: 3.8, avg_salary_max: 174475 },
  ],
  seniority: [
    { seniority: 'mid', posting_count: 160, avg_fs: 54.0, avg_uj: 65.0, avg_tools: 3.0 },
    { seniority: 'senior', posting_count: 92, avg_fs: 55.0, avg_uj: 66.0, avg_tools: 3.5 },
    { seniority: 'junior', posting_count: 43, avg_fs: 50.0, avg_uj: 62.0, avg_tools: 2.5 },
    { seniority: 'lead', posting_count: 44, avg_fs: 56.0, avg_uj: 67.0, avg_tools: 3.8 },
    { seniority: 'head', posting_count: 7, avg_fs: 58.0, avg_uj: 70.0, avg_tools: 4.2 },
    { seniority: 'vp', posting_count: 5, avg_fs: 60.0, avg_uj: 72.0, avg_tools: 5.0 },
  ],
  remote: [
    { remote_policy: 'hybrid', posting_count: 290 },
    { remote_policy: 'remote', posting_count: 44 },
    { remote_policy: 'onsite', posting_count: 17 },
  ],
  tiers: {
    fs: { high_risk: 5, moderate_risk: 277, low_risk: 70, minimal: 47 },
    uj: { unicorn: 3, stretched: 278, reasonable: 70, focused: 48 },
  },
  companies: [
    { company_name: 'Pinnacle Method Consulting', company_industry: 'Staffing', posting_count: 11, avg_fs: 58, avg_uj: 68, avg_tools: 4 },
    { company_name: 'Penske Truck Leasing', company_industry: 'Truck Transportation', posting_count: 11, avg_fs: 55, avg_uj: 65, avg_tools: 3 },
    { company_name: 'Amazon', company_industry: 'Software Development', posting_count: 9, avg_fs: 60, avg_uj: 70, avg_tools: 5 },
    { company_name: 'Amazon Web Services', company_industry: 'IT Services', posting_count: 7, avg_fs: 62, avg_uj: 72, avg_tools: 6 },
    { company_name: 'Iterable', company_industry: 'Software Development', posting_count: 7, avg_fs: 55, avg_uj: 65, avg_tools: 4 },
    { company_name: 'JPMorganChase', company_industry: 'Financial Services', posting_count: 5, avg_fs: 58, avg_uj: 70, avg_tools: 5 },
    { company_name: 'Google', company_industry: 'Software Development', posting_count: 5, avg_fs: 52, avg_uj: 64, avg_tools: 4 },
    { company_name: 'Deloitte', company_industry: 'IT Services', posting_count: 5, avg_fs: 56, avg_uj: 68, avg_tools: 4 },
    { company_name: 'Salesforce', company_industry: 'Software Development', posting_count: 5, avg_fs: 60, avg_uj: 72, avg_tools: 7 },
    { company_name: 'NTT DATA', company_industry: 'IT Services', posting_count: 4, avg_fs: 55, avg_uj: 70, avg_tools: 3 },
  ],
  toolDistribution: [],
}

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
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })

  return (
    <footer
      className="mt-16 pt-8 pb-12"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-2xl mb-1" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#F5F5F5' }}>
            RevStack Intelligence
          </p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Data from {totalPostings.toLocaleString()} RevOps job postings across {regionCount} regions
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: '#6B7280' }}>Last updated</p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>{formatted} UTC</p>
        </div>
      </div>
    </footer>
  )
}

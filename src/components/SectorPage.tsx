import Link from 'next/link'
import JobCard from './JobCard'
import { Job, SectorConfig } from '@/lib/types'
import { formatDate } from '@/lib/jobs'

interface Props {
  sector: SectorConfig
  jobs: Job[]
  children?: React.ReactNode
}

export default function SectorPage({ sector, jobs, children }: Props) {
  const activeJobs = jobs.filter((j) => j.status === 'active' || j.status === 'closing-soon')
  const closedJobs = jobs.filter((j) => j.status === 'closed' || j.status === 'result-out' || j.status === 'admit-card-out')

  return (
    <div>
      {/* Sector Hero */}
      <div className={`${sector.bgColor} border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className={`text-sm font-medium ${sector.color}`}>{sector.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{sector.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{sector.label} Jobs 2026</h1>
              <p className="text-gray-600 mt-1">{sector.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
              <p className="text-sm text-gray-500">Active Notifications</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.reduce((sum, j) => sum + j.totalVacancies, 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500">Total Vacancies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Additional content (subsector links etc.) */}
        {children}

        {/* Active notifications */}
        {activeJobs.length > 0 && (
          <section className="mb-10">
            <h2 className="section-heading mb-6">Active Notifications</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* Closed / Result out */}
        {closedJobs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-4">Recent / Closed</h2>
            <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200">
              {closedJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.slug}/`}>
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.organization} · {job.totalVacancies.toLocaleString()} vacancies</p>
                    </div>
                    <div className="text-right">
                      <span className="badge bg-gray-100 text-gray-600 text-xs">
                        {job.status === 'result-out' ? 'Result Out' : 'Closed'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">Closed: {formatDate(job.applicationEnd)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {jobs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-lg font-medium">No notifications right now</p>
            <p className="text-sm mt-1">Check back soon — we update daily!</p>
          </div>
        )}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import JobCard from '@/components/JobCard'
import { getAllJobs } from '@/lib/jobs'
import { SECTORS } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'All Government Jobs 2026 – Complete List',
  description: 'Complete list of all latest government job notifications 2026. Bank, SSC, Railways, State Govt, Teaching, PSU, Defence, Police.',
}

export default function AllJobsPage() {
  const jobs = getAllJobs()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Government Jobs 2026</h1>
        <p className="text-gray-500">{jobs.length} notifications — updated daily</p>
      </div>

      {/* Sector filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/jobs/" className="badge bg-blue-600 text-white px-3 py-1.5 text-sm">All</Link>
        {SECTORS.map((s) => (
          <Link key={s.id} href={`/${s.id}/`} className="badge bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 text-sm transition-colors">
            {s.icon} {s.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

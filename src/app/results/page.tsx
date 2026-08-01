import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllJobs, formatDate } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Government Exam Results 2026 – Latest Results',
  description: 'Latest government exam results 2026. IBPS, SSC, RRB, UPSC, state PSC results. Check your result here.',
}

export default function ResultsPage() {
  const resultJobs = getAllJobs().filter((j) => j.status === 'result-out' || j.resultDate)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Results 2026</h1>
      <p className="text-gray-500 mb-8">Latest government exam results — updated as soon as declared</p>

      {resultJobs.length > 0 ? (
        <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200">
          {resultJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.slug}/`}>
              <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.organization}</p>
                </div>
                <div className="text-right">
                  <span className="badge bg-green-100 text-green-700 text-xs">Result Out</span>
                  {job.resultDate && (
                    <p className="text-xs text-gray-400 mt-1">{formatDate(job.resultDate)}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-lg font-medium text-gray-600">No results declared yet</p>
          <p className="text-sm mt-1">We update this page as soon as results are out!</p>
        </div>
      )}
    </div>
  )
}

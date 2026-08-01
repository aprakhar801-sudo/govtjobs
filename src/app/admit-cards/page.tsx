import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllJobs, formatDate } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Admit Cards 2026 – Download Hall Tickets',
  description: 'Download latest government exam admit cards 2026. IBPS, SSC, RRB, UPSC hall tickets. Direct links to official sites.',
}

export default function AdmitCardsPage() {
  const admitCardJobs = getAllJobs().filter(
    (j) => j.status === 'admit-card-out' || j.admitCardDate
  )
  const upcomingExams = getAllJobs().filter(
    (j) => j.examDate && new Date(j.examDate) > new Date()
  ).slice(0, 10)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admit Cards 2026</h1>
      <p className="text-gray-500 mb-8">Download hall tickets from official sources — linked directly</p>

      {admitCardJobs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎫 Admit Cards Available Now</h2>
          <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200">
            {admitCardJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.slug}/`}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.organization}</p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700 text-xs">Admit Card Out</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Upcoming Exams</h2>
        <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200">
          {upcomingExams.map((job) => (
            <Link key={job.id} href={`/jobs/${job.slug}/`}>
              <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.organization}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Exam Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(job.examDate!)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

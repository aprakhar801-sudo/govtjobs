import type { Metadata } from 'next'
import Link from 'next/link'
import JobCard from '@/components/JobCard'
import { getAllJobs, getClosingSoon, getLatestJobs } from '@/lib/jobs'
import { SECTORS } from '@/lib/types'

export const metadata: Metadata = {
  title: 'GovtJobsPortal – Latest Government Jobs 2026 | Sarkari Naukri',
  description:
    'Latest government job notifications for Bank, SSC, Railways, State Govt, Teaching, PSU & Defence. AI-powered summaries, eligibility tables, FAQs. Updated daily.',
}

export default function HomePage() {
  const latestJobs = getLatestJobs(12)
  const closingSoon = getClosingSoon(7)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your <span className="text-yellow-400">Sarkari Naukri</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            AI-powered summaries, eligibility tables & deadline alerts for every government job —
            Banking, Railways, SSC, State PSC, Teaching & more.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SECTORS.map((s) => (
              <Link
                key={s.id}
                href={`/${s.id}/`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm">
          <span>📋 {getAllJobs().length} Active Notifications</span>
          <span>⏰ {closingSoon.length} Closing This Week</span>
          <span>🤖 Updated Daily via AI</span>
          <span>📍 All India + State-wise</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Closing Soon Alert */}
        {closingSoon.length > 0 && (
          <section className="mb-10">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h2 className="text-red-700 font-bold text-lg mb-4">
                ⚠️ Closing This Week — Apply Now
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {closingSoon.slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} compact />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sector cards */}
        <section className="mb-12">
          <h2 className="section-heading">Browse by Sector</h2>
          <p className="text-gray-500 mb-6">Each sector is updated daily with the latest notifications</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SECTORS.map((s) => (
              <Link key={s.id} href={`/${s.id}/`}>
                <div className={`card p-5 text-center hover:scale-105 transition-transform cursor-pointer ${s.bgColor}`}>
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <h3 className={`font-bold ${s.color} text-sm`}>{s.label}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Latest Notifications</h2>
              <p className="text-gray-500">Freshest job alerts, summarized by AI</p>
            </div>
            <Link href="/jobs/" className="btn-outline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Why us section */}
        <section className="mt-16 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="section-heading text-center mb-8">Why GovtJobsPortal?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Summaries',
                desc: 'Every notification is summarized by Claude AI — no more reading 50-page PDFs.',
              },
              {
                icon: '📋',
                title: 'Eligibility Tables',
                desc: 'Instantly know if you qualify — age, qualification, category — all in a simple table.',
              },
              {
                icon: '⏰',
                title: 'Never Miss a Deadline',
                desc: 'Closing-soon alerts, exam date reminders, and result notifications — daily.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

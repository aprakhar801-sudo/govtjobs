import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JobCard from '@/components/JobCard'
import { getJobsByState, getSectorConfig } from '@/lib/jobs'

interface Props {
  params: { state: string }
}

const STATES = [
  'gujarat','uttar-pradesh','maharashtra','rajasthan','bihar',
  'madhya-pradesh','karnataka','tamil-nadu','andhra-pradesh',
  'telangana','kerala','west-bengal','punjab','haryana','delhi',
  'himachal-pradesh','uttarakhand','jharkhand','chhattisgarh',
  'odisha','assam','goa',
]

export async function generateStaticParams() {
  return STATES.map((state) => ({ state }))
}

// Convert slug to display name
function slugToName(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = slugToName(params.state)
  return {
    title: `${name} Government Jobs 2026 – State PSC Recruitment`,
    description: `Latest ${name} state government job notifications 2026. Check vacancies, eligibility, exam dates and apply online.`,
  }
}

export default function StatePage({ params }: Props) {
  const stateName = slugToName(params.state)
  const jobs = getJobsByState(stateName)
  const sector = getSectorConfig('state-govt')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link href="/state-govt/" className="hover:text-gray-700">State Govt</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{stateName}</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-5xl">{sector.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{stateName} Govt Jobs 2026</h1>
          <p className="text-gray-500">Latest state government recruitment notifications</p>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg font-medium text-gray-600">No active notifications for {stateName}</p>
          <p className="text-sm mt-1">Check back soon — we update daily!</p>
          <Link href="/state-govt/" className="btn-primary mt-6 inline-flex">
            ← All State Jobs
          </Link>
        </div>
      )}
    </div>
  )
}

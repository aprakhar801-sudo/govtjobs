'use client'
import Link from 'next/link'
import { Job } from '@/lib/types'
import { formatDate, getStatusBadge, daysLeft } from '@/lib/jobs'

interface Props {
  job: Job
  compact?: boolean
}

export default function JobCard({ job, compact = false }: Props) {
  const badge = getStatusBadge(job)
  const left = daysLeft(job.applicationEnd)

  return (
    <div className="card p-5 group flex flex-col">
      {/* Top row — clicking title goes to detail page */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link href={`/jobs/${job.slug}/`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-base leading-snug cursor-pointer">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{job.organization}</p>
        </div>
        <span className={`badge ${badge.color} shrink-0`}>{badge.label}</span>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <Stat label="Vacancies" value={job.totalVacancies.toLocaleString('en-IN')} />
        <Stat label="Age Limit" value={`${job.ageMin}–${job.ageMax} yrs`} />
        <Stat label="Last Date" value={formatDate(job.applicationEnd)} highlight={left <= 7 && left >= 0} />
        <Stat label="Salary" value={job.salaryLabel ?? 'As per 7th CPC'} small />
      </div>

      {/* Qualifications + tags */}
      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.qualifications.map((q) => (
            <span key={q} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              {q}
            </span>
          ))}
          {job.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
        <Link
          href={`/jobs/${job.slug}/`}
          className="flex-1 text-center text-xs font-medium text-blue-700 hover:text-blue-900 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Full Details →
        </Link>
        {job.notificationUrl && (
          <a
            href={job.notificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            📄 Notification
          </a>
        )}
        <a
          href={job.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium text-green-700 hover:text-green-900 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
        >
          🔗 Official Site
        </a>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  highlight = false,
  small = false,
}: {
  label: string
  value: string
  highlight?: boolean
  small?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-medium ${small ? 'text-xs' : 'text-sm'} ${highlight ? 'text-red-600' : 'text-gray-900'} leading-tight mt-0.5`}>
        {value}
      </p>
    </div>
  )
}

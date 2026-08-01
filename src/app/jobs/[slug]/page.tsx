import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllJobs, getJobBySlug, formatDate, getSectorConfig } from '@/lib/jobs'
import jobsData from '../../../../data/jobs.json'

interface Props {
  params: { slug: string }
}

// Read directly from JSON (bypasses filters) so build always succeeds
export async function generateStaticParams() {
  const jobs = jobsData as { slug: string }[]
  return jobs.map((job) => ({ slug: job.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = getJobBySlug(params.slug)
  if (!job) return {}
  return {
    title: `${job.title} – ${job.totalVacancies.toLocaleString()} Vacancies`,
    description: job.metaDescription,
    openGraph: {
      title: `${job.title} – ${job.totalVacancies.toLocaleString()} Vacancies | GovtJobsPortal`,
      description: job.metaDescription,
      type: 'article',
    },
  }
}

export default function JobDetailPage({ params }: Props) {
  const job = getJobBySlug(params.slug)
  if (!job) notFound()

  const sector = getSectorConfig(job.sector)

  // JobPosting schema.org structured data
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organization,
      sameAs: job.officialUrl,
    },
    datePosted: job.applicationStart,
    validThrough: job.applicationEnd,
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    },
    baseSalary: job.salaryMin
      ? {
          '@type': 'MonetaryAmount',
          currency: 'INR',
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: 'MONTH',
          },
        }
      : undefined,
    employmentType: 'FULL_TIME',
    url: `https://www.govtjobsportal.com/jobs/${job.slug}/`,
  }

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: job.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link href={`/${job.sector}/`} className="hover:text-gray-700">{sector.label}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{job.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title card */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className={`badge ${sector.bgColor} ${sector.color} mb-2`}>
                    {sector.icon} {sector.label}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">{job.title}</h1>
                  <p className="text-gray-500 mt-1">{job.organization}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{job.summary}</p>
              {/* Highlights */}
              <ul className="mt-4 space-y-2">
                {job.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Dates */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">📅 Important Dates</h2>
              <div className="divide-y divide-gray-100">
                {job.importantDates.map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600">{d.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatDate(d.date)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3">✅ Eligibility</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{job.eligibility}</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Age Limit</p>
                  <p className="font-bold text-gray-900">{job.ageMin}–{job.ageMax} years</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Vacancies</p>
                  <p className="font-bold text-gray-900">{job.totalVacancies.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Qualification</p>
                  <p className="font-bold text-gray-900 text-xs">{job.qualifications[0]}</p>
                </div>
              </div>
            </div>

            {/* Selection Process */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">🎯 Selection Process</h2>
              <div className="flex flex-wrap items-center gap-2">
                {job.selectionProcess.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </div>
                    {i < job.selectionProcess.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3">📝 How to Apply</h2>
              <ol className="space-y-2">
                {job.howToApply.split('\n').filter(Boolean).map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700">
                    <span className="shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* FAQs */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">❓ Frequently Asked Questions</h2>
              <div className="space-y-4">
                {job.faqs.map((faq, i) => (
                  <details key={i} className="group border border-gray-200 rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">
                      {faq.question}
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply CTA */}
            <div className="card p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Application Deadline</p>
              <p className="text-xl font-bold text-red-600 mb-4">{formatDate(job.applicationEnd)}</p>
              <a
                href={job.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center py-3 text-base"
              >
                Apply on Official Site →
              </a>
              {job.notificationUrl && (
                <a
                  href={job.notificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full justify-center mt-2 py-2"
                >
                  📄 Download Notification
                </a>
              )}
            </div>

            {/* Quick facts */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  { label: 'Organization', value: job.shortOrg },
                  { label: 'Vacancies', value: job.totalVacancies.toLocaleString('en-IN') },
                  { label: 'Salary', value: job.salaryLabel ?? 'As per 7th CPC' },
                  { label: 'Apply From', value: formatDate(job.applicationStart) },
                  { label: 'Last Date', value: formatDate(job.applicationEnd) },
                  ...(job.examDate ? [{ label: 'Exam Date', value: formatDate(job.examDate) }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900 text-right max-w-[140px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
              ⚠️ Always verify information on the official website before applying. Exam dates and
              vacancies are subject to change.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

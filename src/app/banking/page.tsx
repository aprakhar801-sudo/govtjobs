import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Banking Jobs 2026 – IBPS, SBI, RBI, NABARD',
  description:
    'Latest bank job notifications 2026. IBPS PO, Clerk, SO; SBI PO, Clerk; RBI Grade B, NABARD. Check vacancies, eligibility, salary & apply online.',
}

export default function BankingPage() {
  const sector = getSectorConfig('banking')
  const jobs = getJobsBysector('banking')

  const subsectors = [
    { name: 'IBPS', desc: 'PO, Clerk, SO, RRB', href: '#' },
    { name: 'SBI', desc: 'PO, Clerk, Specialist', href: '#' },
    { name: 'RBI', desc: 'Grade B, Assistant', href: '#' },
    { name: 'NABARD', desc: 'Grade A, B', href: '#' },
    { name: 'Regional Rural Banks', desc: 'RRB PO, Clerk', href: '#' },
    { name: 'Other Banks', desc: 'PSU Bank notifications', href: '#' },
  ]

  return (
    <SectorPage sector={sector} jobs={jobs}>
      {/* Sub-sector quick links */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Browse by Bank / Organization</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {subsectors.map((s) => (
            <Link key={s.name} href={s.href}>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <p className="font-semibold text-blue-800 text-sm">{s.name}</p>
                <p className="text-xs text-blue-600 mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO content block */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About Banking Sector Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Banking sector offers some of the most stable and well-paying government jobs in India. IBPS
          conducts centralized recruitment for 11 public sector banks, while SBI, RBI, and NABARD run
          independent recruitment. Typical posts include Probationary Officer (PO), Clerk, Specialist
          Officer (SO), and Management Trainee. Selection usually involves a Prelims exam, Mains exam,
          and Interview. Graduates with computer proficiency are eligible for most banking posts.
        </p>
      </div>
    </SectorPage>
  )
}

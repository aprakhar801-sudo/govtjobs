import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Central Government Jobs 2026 – SSC, UPSC, NTA',
  description:
    'Latest central government job notifications. SSC CGL, CHSL, MTS; UPSC Civil Services; NTA recruitment 2026. Eligibility, vacancies, salary, exam dates.',
}

export default function CentralGovtPage() {
  const sector = getSectorConfig('central-govt')
  const jobs = getJobsBysector('central-govt')

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About Central Government Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Central government jobs are among the most coveted in India, offering job security, excellent
          pay, and career growth. Key recruiting bodies include SSC (Group B/C posts for graduates),
          UPSC (IAS, IPS, and Group A services), and NTA (various university and research positions).
          Posts range from clerical to Class 1 Gazetted Officer level. Selection typically involves
          written exams, and sometimes interviews, skill tests, and document verification.
        </p>
      </div>
    </SectorPage>
  )
}

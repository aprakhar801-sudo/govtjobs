import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Defence Jobs 2026 – Army, Navy, Air Force, DRDO, ISRO',
  description:
    'Latest defence recruitment notifications 2026. Indian Army, Navy, Air Force, DRDO, ISRO, Agniveer. Check eligibility, vacancies & apply.',
}

export default function DefencePage() {
  const sector = getSectorConfig('defence')
  const jobs = getJobsBysector('defence')

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About Defence Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Defence sector offers diverse career opportunities from frontline military service to
          research and development. Indian Army, Navy, and Air Force recruit officers through NDA,
          CDS, and AFCAT exams. Agniveer scheme offers short-term service for soldiers. DRDO recruits
          scientists and engineers through GATE and direct interviews. ISRO recruits scientists and
          technicians for its space research programs. Physical fitness standards are mandatory for
          military posts.
        </p>
      </div>
    </SectorPage>
  )
}

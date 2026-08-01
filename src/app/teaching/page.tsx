import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Teaching Jobs 2026 – KVS, NVS, DSSSB, TET',
  description:
    'Latest teaching job notifications 2026. KVS TGT PGT, NVS, DSSSB Teacher, State TET. Eligibility, CTET requirement, salary & apply online.',
}

export default function TeachingPage() {
  const sector = getSectorConfig('teaching')
  const jobs = getJobsBysector('teaching')

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About Teaching Recruitment in India</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Teaching jobs in India span central and state government schools. KVS (Kendriya Vidyalaya
          Sangathan) and NVS (Navodaya Vidyalaya Samiti) recruit centrally for PRT, TGT, and PGT
          posts. DSSSB handles Delhi government teacher vacancies. State governments recruit through
          their own Teacher Recruitment Boards. Most teaching posts require CTET (Central Teacher
          Eligibility Test) or state-level TET qualification in addition to B.Ed degree.
        </p>
      </div>
    </SectorPage>
  )
}

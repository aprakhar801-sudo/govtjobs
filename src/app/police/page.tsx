import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Police Jobs 2026 – CRPF, BSF, CISF, SSB, State Police',
  description:
    'Latest police and paramilitary recruitment 2026. CRPF, BSF, CISF, SSB, ITBP, state police constable, SI, inspector. Check eligibility & apply.',
}

export default function PolicePage() {
  const sector = getSectorConfig('police')
  const jobs = getJobsBysector('police')

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About Police & Paramilitary Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Central paramilitary forces (CRPF, BSF, CISF, SSB, ITBP, CAPF) are recruited through SSC
          CPO exam for Sub-Inspector posts and direct recruitment for constable posts. State police
          forces recruit through state police recruitment boards. Selection involves written tests,
          physical efficiency tests (PET), physical standard tests (PST), and medical examination.
          Candidates must meet strict physical fitness standards including height, chest, and running
          requirements.
        </p>
      </div>
    </SectorPage>
  )
}

import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'PSU Jobs 2026 – ONGC, BHEL, NTPC, SAIL, GAIL',
  description:
    'Latest Public Sector Undertaking job notifications 2026. ONGC, BHEL, NTPC, SAIL, GAIL, HAL, DRDO recruitment. GATE score, eligibility & apply online.',
}

export default function PSUPage() {
  const sector = getSectorConfig('psu')
  const jobs = getJobsBysector('psu')

  const psus = [
    'ONGC', 'BHEL', 'NTPC', 'SAIL', 'GAIL', 'HAL', 'BEL', 'NMDC',
    'Coal India', 'Power Grid', 'IOCL', 'HPCL', 'BPCL', 'NPCIL', 'AAI',
  ]

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Major PSUs</h2>
        <div className="flex flex-wrap gap-2">
          {psus.map((p) => (
            <span key={p} className="text-xs bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About PSU Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Public Sector Undertakings (PSUs) are government-owned corporations that offer excellent
          salaries, perks, and job security. Most engineering PSUs use GATE scores for recruitment
          of Graduate Trainee / Management Trainee posts. Non-engineering PSUs (like Coal India,
          Power Grid) also recruit MBA, CA, and law graduates. PSU perks include HRA, medical
          insurance, LTC, company accommodation, and retirement benefits.
        </p>
      </div>
    </SectorPage>
  )
}

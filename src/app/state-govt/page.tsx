import type { Metadata } from 'next'
import Link from 'next/link'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'State Government Jobs 2026 – PSC, State Board Recruitment',
  description:
    'Latest state government job notifications 2026. GPSC, UPPSC, MPSC, RPSC, BPSC & all state PSCs. Find jobs by state, check eligibility & apply online.',
}

const STATES = [
  { name: 'Gujarat', slug: 'gujarat', board: 'GPSC', icon: '🏙️' },
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', board: 'UPPSC', icon: '🕌' },
  { name: 'Maharashtra', slug: 'maharashtra', board: 'MPSC', icon: '🌊' },
  { name: 'Rajasthan', slug: 'rajasthan', board: 'RPSC', icon: '🏰' },
  { name: 'Bihar', slug: 'bihar', board: 'BPSC', icon: '🌾' },
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', board: 'MPPSC', icon: '🌲' },
  { name: 'Karnataka', slug: 'karnataka', board: 'KPSC', icon: '🌴' },
  { name: 'Tamil Nadu', slug: 'tamil-nadu', board: 'TNPSC', icon: '🏛️' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', board: 'APPSC', icon: '🌊' },
  { name: 'Telangana', slug: 'telangana', board: 'TSPSC', icon: '🏙️' },
  { name: 'Kerala', slug: 'kerala', board: 'Kerala PSC', icon: '🌿' },
  { name: 'West Bengal', slug: 'west-bengal', board: 'WBPSC', icon: '🐯' },
  { name: 'Punjab', slug: 'punjab', board: 'PPSC', icon: '🌾' },
  { name: 'Haryana', slug: 'haryana', board: 'HPSC', icon: '🌻' },
  { name: 'Delhi', slug: 'delhi', board: 'DSSSB', icon: '🏛️' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', board: 'HPPSC', icon: '🏔️' },
  { name: 'Uttarakhand', slug: 'uttarakhand', board: 'UKPSC', icon: '⛰️' },
  { name: 'Jharkhand', slug: 'jharkhand', board: 'JPSC', icon: '🌲' },
  { name: 'Chhattisgarh', slug: 'chhattisgarh', board: 'CGPSC', icon: '🌾' },
  { name: 'Odisha', slug: 'odisha', board: 'OPSC', icon: '🏝️' },
  { name: 'Assam', slug: 'assam', board: 'APSC', icon: '🌿' },
  { name: 'Goa', slug: 'goa', board: 'GPSC Goa', icon: '🏖️' },
]

export default function StateGovtPage() {
  const sector = getSectorConfig('state-govt')
  const jobs = getJobsBysector('state-govt')

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Browse by State</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {STATES.map((state) => (
            <Link key={state.slug} href={`/state-govt/${state.slug}/`}>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center hover:bg-green-100 transition-colors cursor-pointer">
                <div className="text-2xl mb-1">{state.icon}</div>
                <p className="font-semibold text-green-800 text-xs leading-tight">{state.name}</p>
                <p className="text-xs text-green-600 mt-0.5">{state.board}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About State Government Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Each Indian state has its own Public Service Commission (PSC) that conducts recruitment for
          state civil services, including administrative officers, police, teachers, engineers, and
          other state government posts. Eligibility and exam patterns vary by state, but generally
          require graduation and knowledge of the state&apos;s official language. Domicile certificates
          may be required for some states.
        </p>
      </div>
    </SectorPage>
  )
}

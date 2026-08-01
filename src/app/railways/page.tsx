import type { Metadata } from 'next'
import SectorPage from '@/components/SectorPage'
import { getJobsBysector, getSectorConfig } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Railway Jobs 2026 – RRB NTPC, Group D, ALP, JE',
  description:
    'Latest Indian Railways recruitment 2026. RRB NTPC, Group D, ALP, JE, Station Master, Goods Guard. Check eligibility, vacancies, exam pattern & apply.',
}

export default function RailwaysPage() {
  const sector = getSectorConfig('railways')
  const jobs = getJobsBysector('railways')

  const rrbs = [
    'RRB Ahmedabad', 'RRB Allahabad', 'RRB Bangalore', 'RRB Bhopal',
    'RRB Bhubaneswar', 'RRB Bilaspur', 'RRB Chandigarh', 'RRB Chennai',
    'RRB Gorakhpur', 'RRB Guwahati', 'RRB Jammu-Srinagar', 'RRB Kolkata',
    'RRB Malda', 'RRB Mumbai', 'RRB Muzaffarpur', 'RRB Patna',
    'RRB Ranchi', 'RRB Secunderabad', 'RRB Siliguri', 'RRB Thiruvananthapuram',
    'RRB Ajmer',
  ]

  return (
    <SectorPage sector={sector} jobs={jobs}>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">All Railway Recruitment Boards (RRBs)</h2>
        <div className="flex flex-wrap gap-2">
          {rrbs.map((r) => (
            <span key={r} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full">
              {r}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-2">About Railway Recruitment</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Indian Railways is one of the largest employers in the world. Recruitment happens through
          Railway Recruitment Boards (RRBs) for technical and non-technical posts, and Railway
          Recruitment Cells (RRCs) for Level 1 posts. Key exams include RRB NTPC (Non-Technical
          Popular Categories), RRB Group D, RRB ALP (Assistant Loco Pilot), and RRB JE (Junior
          Engineer). Candidates ranging from 10th pass to graduate/diploma are eligible for various
          posts.
        </p>
      </div>
    </SectorPage>
  )
}

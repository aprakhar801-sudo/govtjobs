export type JobStatus = 'active' | 'closing-soon' | 'closed' | 'result-out' | 'admit-card-out'

export type Sector =
  | 'banking'
  | 'central-govt'
  | 'railways'
  | 'state-govt'
  | 'teaching'
  | 'psu'
  | 'defence'
  | 'police'

export interface FAQ {
  question: string
  answer: string
}

export interface ImportantDate {
  label: string
  date: string // ISO string
}

export interface Job {
  id: string                    // e.g. "ibps-po-2026"
  slug: string                  // URL-friendly: "ibps-po-2026"
  title: string                 // "IBPS PO 2026"
  organization: string          // "Institute of Banking Personnel Selection"
  shortOrg: string              // "IBPS"
  sector: Sector
  subsector?: string            // "SBI" | "RBI" | "Gujarat" | "RRB NTPC" etc.
  state?: string                // for state-govt jobs
  totalVacancies: number
  qualifications: string[]      // ["Graduate", "B.Tech", "10th Pass"]
  ageMin: number
  ageMax: number
  salaryMin?: number            // monthly CTC
  salaryMax?: number
  salaryLabel?: string          // "₹36,000 - ₹63,840/month" or "Pay Scale: Level-6"
  applicationStart: string      // ISO date
  applicationEnd: string        // ISO date
  examDate?: string             // ISO date or "To be announced"
  resultDate?: string
  admitCardDate?: string
  officialUrl: string
  notificationUrl?: string
  status: JobStatus
  lastUpdated: string           // ISO datetime
  // AI-generated content
  summary: string               // 2-3 sentence overview
  highlights: string[]          // Key points bullet list
  eligibility: string           // Detailed eligibility paragraph
  howToApply: string            // Step-by-step application guide
  selectionProcess: string[]    // ["Written Exam", "Interview", "Document Verification"]
  faqs: FAQ[]
  importantDates: ImportantDate[]
  tags: string[]                // ["SSC", "CGL", "Graduate", "All India"]
  metaDescription: string       // SEO meta description ~160 chars
}

export interface SectorConfig {
  id: Sector
  label: string
  description: string
  icon: string
  color: string                 // Tailwind color class
  bgColor: string
  sources: string[]             // official websites to scrape
}

export const SECTORS: SectorConfig[] = [
  {
    id: 'banking',
    label: 'Banking',
    description: 'IBPS, SBI, RBI, NABARD & all bank recruitment',
    icon: '🏦',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    sources: ['https://www.ibps.in', 'https://sbi.co.in/careers', 'https://rbi.org.in/Scripts/Opportunities.aspx', 'https://www.nabard.org/careers'],
  },
  {
    id: 'central-govt',
    label: 'Central Govt',
    description: 'SSC, UPSC, NTA & all central government jobs',
    icon: '🏛️',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    sources: ['https://ssc.nic.in', 'https://upsc.gov.in', 'https://nta.ac.in'],
  },
  {
    id: 'railways',
    label: 'Railways',
    description: 'RRB, RRC & Indian Railways recruitment',
    icon: '🚂',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    sources: ['https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,554'],
  },
  {
    id: 'state-govt',
    label: 'State Govt',
    description: 'PSC, state boards & state government jobs',
    icon: '🗺️',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    sources: ['https://gpsc.gujarat.gov.in', 'https://uppsc.up.nic.in', 'https://www.mpsc.gov.in'],
  },
  {
    id: 'teaching',
    label: 'Teaching',
    description: 'KVS, NVS, DSSSB, TET & teaching jobs',
    icon: '📚',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    sources: ['https://kvsangathan.nic.in', 'https://navodaya.gov.in', 'https://dsssb.delhi.gov.in'],
  },
  {
    id: 'psu',
    label: 'PSU',
    description: 'ONGC, BHEL, NTPC, SAIL & public sector units',
    icon: '⚙️',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    sources: ['https://www.ongcindia.com', 'https://www.bhel.com', 'https://www.ntpc.co.in'],
  },
  {
    id: 'defence',
    label: 'Defence',
    description: 'Army, Navy, Air Force, DRDO, ISRO recruitment',
    icon: '⭐',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    sources: ['https://joinindianarmy.nic.in', 'https://www.drdo.gov.in/careers'],
  },
  {
    id: 'police',
    label: 'Police',
    description: 'CRPF, BSF, CISF, SSB & state police jobs',
    icon: '👮',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    sources: ['https://crpf.gov.in/recruitments.htm', 'https://bsf.gov.in'],
  },
]

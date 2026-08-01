import { Job, Sector, SECTORS } from './types'
import jobsData from '../../data/jobs.json'

const allJobs: Job[] = jobsData as Job[]

export function getAllJobs(): Job[] {
  return allJobs.sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  )
}

export function getJobsBysector(sector: Sector): Job[] {
  return allJobs
    .filter((j) => j.sector === sector)
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
}

export function getJobBySlug(slug: string): Job | undefined {
  return allJobs.find((j) => j.slug === slug)
}

export function getLatestJobs(count = 10): Job[] {
  return getAllJobs().slice(0, count)
}

export function getActiveJobs(): Job[] {
  return allJobs.filter((j) => j.status === 'active' || j.status === 'closing-soon')
}

export function getClosingSoon(daysAhead = 7): Job[] {
  const now = new Date()
  const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)
  return allJobs.filter((j) => {
    if (!j.applicationEnd) return false
    const end = new Date(j.applicationEnd)
    return end >= now && end <= future
  })
}

export function getJobsByState(state: string): Job[] {
  return allJobs.filter(
    (j) => j.sector === 'state-govt' && j.state?.toLowerCase() === state.toLowerCase()
  )
}

export function getAllSectorIds(): Sector[] {
  return SECTORS.map((s) => s.id)
}

export function getSectorConfig(id: Sector) {
  return SECTORS.find((s) => s.id === id)!
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'TBA'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysLeft(dateStr: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const end = new Date(dateStr)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function getStatusBadge(job: Job): { label: string; color: string } {
  const left = daysLeft(job.applicationEnd)
  if (job.status === 'closed' || left < 0) return { label: 'Closed', color: 'bg-gray-100 text-gray-600' }
  if (job.status === 'result-out') return { label: 'Result Out', color: 'bg-green-100 text-green-700' }
  if (job.status === 'admit-card-out') return { label: 'Admit Card Out', color: 'bg-blue-100 text-blue-700' }
  if (left <= 3) return { label: `${left}d left`, color: 'bg-red-100 text-red-700' }
  if (left <= 7) return { label: `${left}d left`, color: 'bg-orange-100 text-orange-700' }
  return { label: 'Active', color: 'bg-green-100 text-green-700' }
}

import Link from 'next/link'
import { SECTORS } from '@/lib/types'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏛️</span>
              <span className="text-white font-bold text-lg">GovtJobsPortal</span>
            </div>
            <p className="text-sm leading-relaxed">
              India&apos;s most up-to-date government job portal. AI-powered summaries, eligibility
              tables, and deadline alerts — all in one place.
            </p>
          </div>

          {/* Sectors */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Sectors</h3>
            <ul className="space-y-2">
              {SECTORS.slice(0, 4).map((s) => (
                <li key={s.id}>
                  <Link href={`/${s.id}/`} className="text-sm hover:text-white transition-colors">
                    {s.icon} {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 mt-8 md:mt-0">&nbsp;</h3>
            <ul className="space-y-2">
              {SECTORS.slice(4).map((s) => (
                <li key={s.id}>
                  <Link href={`/${s.id}/`} className="text-sm hover:text-white transition-colors">
                    {s.icon} {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs/" className="hover:text-white transition-colors">All Jobs</Link></li>
              <li><Link href="/results/" className="hover:text-white transition-colors">Results</Link></li>
              <li><Link href="/admit-cards/" className="hover:text-white transition-colors">Admit Cards</Link></li>
              <li><Link href="/about/" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} GovtJobsPortal. All rights reserved.</p>
          <p className="text-center">
            Disclaimer: This site is for informational purposes. Always verify details on official
            websites before applying.
          </p>
        </div>
      </div>
    </footer>
  )
}

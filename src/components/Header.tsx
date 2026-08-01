'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SECTORS } from '@/lib/types'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top strip */}
      <div className="bg-blue-700 text-white text-xs text-center py-1 px-4">
        🔔 Updated daily with AI-powered job summaries | Subscribe for alerts
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <div>
              <span className="text-lg font-bold text-blue-700">GovtJobs</span>
              <span className="text-lg font-bold text-gray-800">Portal</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {SECTORS.map((s) => (
              <Link
                key={s.id}
                href={`/${s.id}/`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/jobs/" className="hidden sm:block btn-primary text-xs py-1.5 px-3">
              All Jobs
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-1">
              {SECTORS.map((s) => (
                <Link
                  key={s.id}
                  href={`/${s.id}/`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

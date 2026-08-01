import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'GovtJobsPortal – Latest Government Jobs 2026',
    template: '%s | GovtJobsPortal',
  },
  description:
    'Find the latest government job notifications for Banking, SSC, Railways, State Govt, Teaching, PSU & Defence. Updated daily with AI-powered summaries, eligibility tables, and FAQs.',
  keywords: ['government jobs', 'sarkari naukri', 'IBPS', 'SSC', 'Railways', 'UPSC', 'bank jobs'],
  metadataBase: new URL('https://www.govtjobsportal.com'),
  openGraph: {
    siteName: 'GovtJobsPortal',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

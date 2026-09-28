// BIS Sarathi — Industry / MSME journey page
// Route: /industry
//
// This is a server component page that delegates all interactivity to
// the IndustryJourney client component.
//
// Requirements: 5.1–5.8

import type { Metadata } from 'next'
import { IndustryJourney } from '@/components/journeys/IndustryJourney'

export const metadata: Metadata = {
  title: 'Industry / MSME — BIS Sarathi',
  description: 'Find the right BIS standard and testing labs for your product.',
}

export default function IndustryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <IndustryJourney />
    </div>
  )
}

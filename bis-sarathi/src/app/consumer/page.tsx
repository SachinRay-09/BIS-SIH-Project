// BIS Sarathi — Consumer journey page
// Route: /consumer
//
// Server component page — delegates all rendering to ConsumerJourney.
//
// Requirements: 6.1, 6.2

import type { Metadata } from 'next'
import { ConsumerJourney } from '@/components/journeys/ConsumerJourney'

export const metadata: Metadata = {
  title: 'Consumer — BIS Sarathi',
  description: 'Understand BIS standards, ISI marks, and your consumer rights.',
}

export default function ConsumerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ConsumerJourney />
    </div>
  )
}

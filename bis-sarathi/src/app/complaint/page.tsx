// BIS Sarathi — Complaint Journey Page
// Route: /complaint
//
// Standalone complaint preparation page.
// Renders ComplaintJourney inside a constrained-width content area.
//
// "Submit to BIS" MUST NOT appear anywhere on this page or in
// any child component rendered here (Requirements 8.7, 8.8).
//
// Server component — no client state needed.
// Requirements: 8.1, 8.2, 8.3, 8.4, 8.5

import type { Metadata } from 'next'
import { ComplaintJourney } from '@/components/journeys/ComplaintJourney'

export const metadata: Metadata = {
  title: 'Complaint Journey — BIS Sarathi',
  description:
    'Structure a complaint about a product carrying an ISI mark. ' +
    'Sarathi extracts the complaint fields and guides you to the official BIS Care channel.',
}

export default function ComplaintPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ComplaintJourney />
    </div>
  )
}

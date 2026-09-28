// BIS Sarathi — Licence Verification Journey Page
// Route: /verify
//
// Standalone verification journey page.
// Renders VerificationJourney inside a constrained-width content area.
//
// "Verified by BIS" MUST NOT appear anywhere on this page or in
// any child component rendered here (Requirements 9.4, 1.2).
// No green badge or verified status indicator is used (Requirements 9.5).
//
// Server component — no client state needed.
// Requirements: 7.1, 7.2, 7.3, 7.4, 9.4

import type { Metadata } from 'next'
import { VerificationJourney } from '@/components/journeys/VerificationJourney'

export const metadata: Metadata = {
  title: 'Licence Verification — BIS Sarathi',
  description:
    'Demo licence verification journey using DEMO-LIC-001 mock data. ' +
    'Not connected to the BIS production registry.',
}

export default function VerifyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <VerificationJourney />
    </div>
  )
}

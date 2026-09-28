// BIS Sarathi — /evidence route
// Server component wrapper that provides page metadata and a max-width
// layout shell for the client-rendered EvidencePage component.
//
// Requirements: 11.1, 11.2, 11.3, 11.4, 11.5

import type { Metadata } from 'next'
import { EvidencePage } from '@/components/EvidencePage'

export const metadata: Metadata = {
  title: 'Evidence — BIS Sarathi',
  description: 'All evidence records used in this BIS Sarathi demonstration.',
}

export default function EvidencePageRoute() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <EvidencePage />
    </div>
  )
}

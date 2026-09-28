// BIS Sarathi — Evidence Card
// Displays a single EvidenceRecord with source provenance, freshness metadata,
// and a link to the official source URL.
//
// Visual treatment:
//   - Left border (3px) colour keyed on sourceType:
//       OFFICIAL_BIS    → green  #15803D
//       PUBLIC_BIS_LIMS → blue   #1D4ED8
//       DEMO            → amber  #B45309
//       MOCK            → orange #C2410C
//       SYNTHETIC       → grey   #64748B
//   - Top row: standardOrRecord (bold) + recordType (muted) + SourceBadge
//   - Second row: source name (small muted text) + FreshnessLabel
//   - Body: authority + versionOrRevision + whyUsed paragraph
//   - Footer: external link to officialUrl
//
// This is a server component — no 'use client' directive needed.
// Requirements: 11.2, 11.3, 11.5

import type { EvidenceRecord, SourceType } from '@/lib/types'
import { SourceBadge } from '@/components/ui/SourceBadge'
import { FreshnessLabel } from '@/components/ui/FreshnessLabel'

// ─────────────────────────────────────────────────────────────────────────────
// Border colour map (inline style — safe arbitrary values, avoids Tailwind JIT
// purge issues for dynamically resolved colour strings)
// ─────────────────────────────────────────────────────────────────────────────

const BORDER_COLOURS: Record<SourceType, string> = {
  OFFICIAL_BIS:    '#15803D',
  PUBLIC_BIS_LIMS: '#1D4ED8',
  DEMO:            '#B45309',
  MOCK:            '#C2410C',
  SYNTHETIC:       '#64748B',
}

function getBorderColour(sourceType: SourceType): string {
  return BORDER_COLOURS[sourceType] ?? '#64748B'
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface EvidenceCardProps {
  record: EvidenceRecord
}

/**
 * `EvidenceCard` renders the complete metadata for a single evidence record.
 * It is used on the `/evidence` page and inline inside chat response messages.
 *
 * @example
 * <EvidenceCard record={evidenceRecord} />
 */
export function EvidenceCard({ record }: EvidenceCardProps) {
  const borderColour = getBorderColour(record.sourceType)

  return (
    <article
      style={{ borderLeftColor: borderColour }}
      className="bg-white border border-[#E2E8F0] border-l-[3px] rounded-md p-4 flex flex-col gap-3 transition-opacity duration-200"
      aria-label={`Evidence record: ${record.standardOrRecord}`}
    >
      {/* ── Row 1: identifier + record type + source badge ─────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* J.1 — lang="en" ensures IS numbers are read correctly by screen readers */}
        <span lang="en" className="font-semibold text-[#1A1A2E] text-sm leading-tight">
          {record.standardOrRecord}
        </span>
        <span className="text-xs text-[#64748B]">{record.recordType}</span>
        <SourceBadge sourceType={record.sourceType} />
      </div>

      {/* ── Row 2: source name + freshness label ───────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-[#64748B]">{record.source}</span>
        <FreshnessLabel retrievedAt={record.retrievedAt} />
      </div>

      {/* ── Authority + version/revision ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 text-xs text-[#64748B]">
        <span>
          <span className="font-medium text-[#1A1A2E]">Authority: </span>
          {record.authority}
        </span>
        <span>
          <span className="font-medium text-[#1A1A2E]">Version: </span>
          {record.versionOrRevision}
        </span>
      </div>

      {/* ── Why used ───────────────────────────────────────────────────────── */}
      <p className="text-sm text-[#1A1A2E] leading-relaxed">{record.whyUsed}</p>

      {/* ── Footer: external link to official source ───────────────────────── */}
      <div className="pt-1 border-t border-[#E2E8F0]">
        <a
          href={record.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View official source for ${record.standardOrRecord} (opens in new tab)`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1B2A4A] hover:text-[#FF671F] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
        >
          View official source
          {/* Arrow indicator */}
          <span aria-hidden="true">→</span>
          {/* Screen-reader clarification */}
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </article>
  )
}

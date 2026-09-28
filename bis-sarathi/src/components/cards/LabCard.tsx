// BIS Sarathi — Lab Card
// Displays a single LabRecord from the public BIS LIMS snapshot.
//
// Visual treatment:
//   - Left border 3px blue #1D4ED8 (PUBLIC_BIS_LIMS colour)
//   - Header row: lab name (bold) + SourceBadge (PUBLIC_BIS_LIMS)
//   - Location: city + state
//   - Standards in scope: standardNumbers rendered as small blue pill badges
//   - Scope category in muted text
//   - Validity date (conditional — may be absent in LIMS snapshot)
//   - snapshotLabel + FreshnessLabel in small muted text
//   - Footer: "Visit BIS LIMS →" external link to sourceUrl (new tab)
//
// This is a server component — no 'use client' directive needed.
// Requirements: 5.4, 6.3, 6.4, 6.5, 6.7, 11.4

import type { LabRecord } from '@/lib/types'
import { SourceBadge } from '@/components/ui/SourceBadge'
import { FreshnessLabel } from '@/components/ui/FreshnessLabel'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface LabCardProps {
  lab: LabRecord
}

/**
 * `LabCard` renders the full detail for a single laboratory from the public
 * BIS LIMS snapshot. It always shows the snapshot provenance label and
 * freshness date so judges can immediately identify the data source.
 *
 * All lab records carry `sourceType: 'PUBLIC_BIS_LIMS'`, so the `SourceBadge`
 * is always rendered in blue.
 *
 * @example
 * <LabCard lab={labRecord} />
 */
export function LabCard({ lab }: LabCardProps) {
  return (
    <article
      style={{ borderLeftColor: '#1D4ED8' }}
      className="bg-white border border-[#E2E8F0] border-l-[3px] rounded-md p-4 flex flex-col gap-3 transition-opacity duration-200"
      aria-label={`Laboratory: ${lab.labName}`}
    >
      {/* ── Row 1: lab name + SourceBadge ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-bold text-[#1A1A2E] leading-tight">
          {lab.labName}
        </h3>
        <SourceBadge sourceType={lab.sourceType} />
      </div>

      {/* ── Location: city, state ───────────────────────────────────────────── */}
      <div className="flex items-center gap-1 text-sm text-[#64748B]">
        {/* Inline SVG location pin icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>
          {lab.city}, {lab.state}
        </span>
      </div>

      {/* ── Standards in scope ──────────────────────────────────────────────── */}
      {lab.standardNumbers.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
            Standards in scope
          </span>
          <ul
            className="flex flex-wrap gap-1.5"
            aria-label="Standards in scope for this laboratory"
          >
            {lab.standardNumbers.map((stdNum) => (
              <li key={stdNum}>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE]">
                  {stdNum}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Scope category ──────────────────────────────────────────────────── */}
      <div className="text-xs text-[#64748B]">
        <span className="font-medium text-[#1A1A2E]">Scope: </span>
        {lab.scopeCategory}
      </div>

      {/* ── Validity date (conditional — absent if LIMS snapshot did not include it) */}
      {lab.validityDate && (
        <div className="text-xs text-[#64748B]">
          <span className="font-medium text-[#1A1A2E]">Valid until: </span>
          {lab.validityDate}
        </div>
      )}

      {/* ── Snapshot provenance + freshness ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
        <span>{lab.snapshotLabel}</span>
        <FreshnessLabel retrievedAt={lab.retrievedAt} />
      </div>

      {/* ── Footer: external link to BIS LIMS ──────────────────────────────── */}
      <div className="pt-1 border-t border-[#E2E8F0]">
        <a
          href={lab.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit BIS LIMS page for ${lab.labName} (opens in new tab)`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1B2A4A] hover:text-[#FF671F] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
        >
          Visit BIS LIMS
          <span aria-hidden="true">→</span>
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </article>
  )
}

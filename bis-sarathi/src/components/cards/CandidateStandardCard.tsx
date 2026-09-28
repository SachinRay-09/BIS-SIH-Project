// BIS Sarathi — Candidate Standard Card
// Displays a BIS standard surfaced as a candidate match in a STANDARDS_DISCOVERY
// response. Shows the standard number + year, full title, version notes, a list
// of match reasons, and an external link to the official BIS standards page.
//
// IMPORTANT — prohibited text:
//   This component must NEVER render "Certified by BIS" or "Verified by BIS"
//   in any label, heading, status indicator, or descriptive string.
//   The label "BIS Standard" is used instead of any certification claim.
//
// Visual treatment:
//   - White surface card, left border 3px deep navy (#1B2A4A)
//   - Standard number + year as primary heading (large, navy)
//   - Full title in medium-weight text beneath
//   - Version notes in italic muted text
//   - Match reasons as checkmark-bulleted list
//   - "View on BIS →" external link in the footer
//
// This is a server component — no 'use client' directive needed.
// Requirements: 4.1, 4.2, 5.4, 5.5, 1.2, 9.4

import type { CandidateStandard } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface CandidateStandardCardProps {
  standard: CandidateStandard
}

/**
 * `CandidateStandardCard` renders a single BIS standard candidate returned by
 * the STANDARDS_DISCOVERY response flow. It communicates at a glance which
 * standard was matched, why, and where to find the authoritative source.
 *
 * The component NEVER displays "Certified by BIS" or "Verified by BIS".
 * It uses the neutral label "BIS Standard" to identify record provenance.
 *
 * @example
 * <CandidateStandardCard standard={candidateStandard} />
 */
export function CandidateStandardCard({ standard }: CandidateStandardCardProps) {
  return (
    <article
      style={{ borderLeftColor: '#1B2A4A' }}
      className="bg-white border border-[#E2E8F0] border-l-[3px] rounded-md p-4 flex flex-col gap-3 transition-opacity duration-200"
      aria-label={`Candidate standard: ${standard.standardNumber}`}
    >
      {/* ── Row 1: standard number + year + "BIS Standard" label ─────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold text-[#1B2A4A] leading-tight">
          {standard.standardNumber}
          <span className="font-normal text-[#64748B]">
            {' '}— {standard.year}
          </span>
        </h3>
        {/* Provenance label — intentionally "BIS Standard", never "Certified by BIS" */}
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase text-white bg-[#1B2A4A]"
          aria-label="Record type: BIS Standard"
        >
          {/* Screen-reader prefix */}
          <span className="sr-only">Record type: </span>
          BIS Standard
        </span>
      </div>

      {/* ── Standard title ───────────────────────────────────────────────── */}
      <p className="text-sm font-medium text-[#1A1A2E] leading-snug">
        {standard.title}
      </p>

      {/* ── Version notes (italic, muted) ────────────────────────────────── */}
      {standard.versionNotes && (
        <p className="text-xs italic text-[#64748B]">
          {standard.versionNotes}
        </p>
      )}

      {/* ── Match reasons ────────────────────────────────────────────────── */}
      {standard.matchReasons.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
            Why surfaced
          </span>
          <ul
            className="flex flex-col gap-1.5"
            aria-label="Reasons this standard was surfaced"
          >
            {standard.matchReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 text-sm text-[#1A1A2E]"
              >
                {/* Checkmark — inline SVG, green to indicate a positive match signal */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Footer: external link to BIS standards page ──────────────────── */}
      <div className="pt-1 border-t border-[#E2E8F0]">
        <a
          href="https://www.bis.gov.in/index.php/standards/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${standard.standardNumber} on BIS website (opens in new tab)`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1B2A4A] hover:text-[#FF671F] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
        >
          View on BIS
          <span aria-hidden="true">→</span>
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </article>
  )
}

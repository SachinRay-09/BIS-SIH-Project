// BIS Sarathi — Verification Result Card
// Displays a VerificationSummary in response to a licence/mark check.
//
// CRITICAL CONSTRAINTS (Requirements 9.4, 1.2, 7.4, 7.5):
//   - MUST display an amber warning banner (bg #FEF3C7, border #F59E0B, text #92400E)
//     containing the full warningText as the FIRST visible element.
//   - MUST display a "DEMO RECORD" label — never a green "Verified" label.
//   - MUST NOT contain the text "Verified by BIS" anywhere.
//   - MUST NOT use green (#15803D or any green hue) for any status indicator.
//   - Status is displayed in amber (#B45309) to reinforce the mock/demo nature.
//
// This is a server component — no 'use client' directive needed.
// Requirements: 7.1, 7.2, 7.3, 7.4, 9.4

import type { VerificationSummary } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface VerificationResultProps {
  result: VerificationSummary
}

/**
 * `VerificationResult` renders a demo licence verification outcome.
 *
 * It always begins with an amber warning banner so the user immediately
 * understands this is a mock/demo record — not a live BIS registry lookup.
 * No green visual treatment is used anywhere in this component.
 *
 * @example
 * <VerificationResult result={verificationSummary} />
 */
export function VerificationResult({ result }: VerificationResultProps) {
  return (
    <article
      className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden"
      aria-label={`Verification result for licence ${result.licenceId}`}
    >
      {/* ── Amber warning banner — MUST be first visible element ────────────
          Requirements: 9.6, 7.4
          bg  : #FEF3C7  (amber-100)
          border: #F59E0B (amber-400)
          text: #92400E  (amber-900)
      ───────────────────────────────────────────────────────────────────────── */}
      <div
        role="alert"
        style={{
          backgroundColor: '#FEF3C7',
          borderBottom: '2px solid #F59E0B',
        }}
        className="px-4 py-3 flex gap-3 items-start"
      >
        {/* Warning icon — amber, not green */}
        <span
          aria-hidden="true"
          style={{ color: '#B45309' }}
          className="mt-0.5 text-base leading-none flex-shrink-0"
        >
          ⚠
        </span>
        <p
          style={{ color: '#92400E' }}
          className="text-xs leading-relaxed font-medium"
        >
          {result.warningText}
        </p>
      </div>

      {/* ── Card body ───────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-4">

        {/* ── "DEMO RECORD" label — amber/orange, NOT green ─────────────────
            Requirements: 9.2
        ────────────────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <span
            style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #F59E0B',
            }}
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
          >
            Demo Record
          </span>
          {/* Screen-reader clarification */}
          <span className="sr-only">
            This is a mock demonstration record, not a real BIS licence.
          </span>
        </div>

        {/* ── Licence ID ────────────────────────────────────────────────────
            Requirements: 9.1, 9.2
        ────────────────────────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">
            Licence / Identifier
          </p>
          <p
            className="text-lg font-bold tracking-tight"
            style={{ color: '#1A1A2E' }}
          >
            {result.licenceId}
          </p>
        </div>

        {/* ── Status — amber styling, never green ───────────────────────────
            Requirements: 9.3, 9.4, 9.5
        ────────────────────────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">
            Status
          </p>
          <span
            style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #F59E0B',
            }}
            className="inline-block text-sm font-semibold px-3 py-1 rounded"
          >
            {result.status}
          </span>
        </div>

        {/* ── Source — explicitly mock/demo ─────────────────────────────────
            Requirements: 9.3
        ────────────────────────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">
            Source
          </p>
          <p className="text-sm text-[#64748B]">Demo dataset — not connected to BIS production registry</p>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <hr className="border-[#E2E8F0]" />

        {/* ── Official portal notice ────────────────────────────────────────
            Requirements: 9.6
        ────────────────────────────────────────────────────────────────────── */}
        <p className="text-xs text-[#64748B] leading-relaxed">
          To verify a real BIS licence, visit the{' '}
          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official BIS portal (opens in new tab)"
            className="font-medium text-[#1B2A4A] underline hover:text-[#FF671F] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
          >
            official BIS portal
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          .
        </p>
      </div>
    </article>
  )
}

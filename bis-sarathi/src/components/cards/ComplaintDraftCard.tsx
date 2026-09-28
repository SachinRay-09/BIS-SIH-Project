// BIS Sarathi — Complaint Draft Card
// Displays a structured complaint draft with extracted fields.
// Missing fields are highlighted in amber with a "Missing — please provide" indicator.
//
// CRITICAL CONSTRAINTS (Requirements 8.1–8.5, 8.7, 8.8, 14.3):
//   - "Submit to BIS" MUST NOT appear anywhere in this component — not in button
//     labels, headings, body text, or aria labels.
//   - The official channel action is an external link to the BIS Care portal.
//   - Missing fields are highlighted with amber background and an amber indicator.
//   - The component NEVER submits data to any server or external service.
//   - Draft notice states: "AI prepares the draft. The user reviews and confirms
//     before any official action."
//
// This is a server component — no 'use client' directive needed.
// Requirements: 8.1, 8.2, 8.3, 8.4, 8.5

import type { ComplaintField } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface ComplaintDraftCardProps {
  /** Array of complaint fields to display. Missing fields (`isMissing: true`) are
   *  highlighted in amber with a "Missing — please provide" indicator. */
  fields: ComplaintField[]
}

/**
 * `ComplaintDraftCard` renders a structured complaint preparation draft.
 *
 * It displays all extracted fields in a two-column row layout. Any field
 * marked `isMissing: true` receives amber visual treatment and a
 * "Missing — please provide" indicator to prompt the user to supply
 * the required information.
 *
 * The footer provides a count of outstanding missing fields (if any) and
 * an external link that opens the official BIS Care portal in a new tab.
 * This component NEVER contains a "Submit to BIS" button or any element
 * that implies automated submission.
 *
 * @example
 * <ComplaintDraftCard fields={complaintFields} />
 */
export function ComplaintDraftCard({ fields }: ComplaintDraftCardProps) {
  const missingCount = fields.filter((f) => f.isMissing).length

  return (
    <article
      className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden"
      aria-label="Complaint draft"
    >
      {/* ── Header ────────────────────────────────────────────────────────────
          Requirements: 8.1, 8.3
          Left accent in deep navy — standard structured-response treatment.
      ────────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid #E2E8F0',
          borderLeft: '3px solid #1B2A4A',
        }}
        className="px-4 py-3 flex items-center gap-3"
      >
        {/* Document icon */}
        <span
          aria-hidden="true"
          style={{ color: '#1B2A4A' }}
          className="text-base leading-none flex-shrink-0"
        >
          📋
        </span>
        <div>
          <h3
            style={{ color: '#1A1A2E' }}
            className="text-sm font-bold uppercase tracking-wide"
          >
            Complaint Draft
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            AI prepares the draft. The user reviews and confirms before any official action.
          </p>
        </div>
      </div>

      {/* ── Field rows ────────────────────────────────────────────────────────
          Requirements: 8.1, 8.2
          Each field is a two-column row: label (muted) + value or missing indicator.
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="divide-y divide-[#E2E8F0]">
        {fields.map((field, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(120px,30%)_1fr] gap-3 px-4 py-3 items-start"
          >
            {/* ── Label ───────────────────────────────────────────────────── */}
            <dt
              className="text-xs text-[#64748B] font-medium uppercase tracking-wide pt-0.5"
            >
              {field.label}
            </dt>

            {/* ── Value or missing indicator ──────────────────────────────── */}
            <dd className="m-0">
              {field.isMissing ? (
                /* ── Missing field — amber visual treatment ──────────────────
                    Requirements: 8.2
                    bg  : #FEF3C7  (amber-100)
                    border: #F59E0B (amber-400)
                    text: #92400E  (amber-900)
                ────────────────────────────────────────────────────────────── */
                <span
                  role="status"
                  aria-label={`${field.label}: missing — please provide`}
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    color: '#92400E',
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded"
                >
                  {/* Warning marker */}
                  <span aria-hidden="true" className="text-[10px]">⚠</span>
                  Missing — please provide
                </span>
              ) : (
                /* ── Populated field — normal text ──────────────────────────
                    Requirements: 8.1
                ────────────────────────────────────────────────────────────── */
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: '#1A1A2E' }}
                >
                  {field.value}
                </span>
              )}
            </dd>
          </div>
        ))}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────────
          Requirements: 8.4, 8.5, 8.7, 8.8
          - Shows missing field count if any fields are outstanding.
          - "Open BIS Care Portal →" external link — NEVER "Submit to BIS".
          - No button or element that implies automated submission to BIS.
      ────────────────────────────────────────────────────────────────────────── */}
      <div
        style={{ borderTop: '1px solid #E2E8F0' }}
        className="px-4 py-3 flex flex-col gap-3"
      >
        {/* ── Missing fields count ──────────────────────────────────────────
            Only rendered when at least one field is missing.
            Requirements: 8.2
        ────────────────────────────────────────────────────────────────────── */}
        {missingCount > 0 && (
          <p
            role="status"
            aria-live="polite"
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              color: '#92400E',
            }}
            className="text-xs font-medium px-3 py-2 rounded flex items-center gap-2"
          >
            <span aria-hidden="true">⚠</span>
            {missingCount} field{missingCount !== 1 ? 's' : ''} need
            {missingCount === 1 ? 's' : ''} to be provided before drafting
          </p>
        )}

        {/* ── Official action note ──────────────────────────────────────────
            Requirement 8.4
        ────────────────────────────────────────────────────────────────────── */}
        <p className="text-xs text-[#64748B] leading-relaxed">
          Complete this draft and submit through the official BIS Care channel.
        </p>

        {/* ── "Open BIS Care Portal →" external link ────────────────────────
            Requirements: 8.5, 8.6, 8.7, 8.8
            This is NEVER labelled "Submit to BIS" — it opens the portal externally.
        ────────────────────────────────────────────────────────────────────── */}
        <a
          href="https://www.bis.gov.in/index.php/bis-care/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open BIS Care portal (opens in new tab)"
          style={{ color: '#1B2A4A' }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-[#FF671F] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded self-start"
        >
          Open BIS Care Portal
          <span aria-hidden="true">→</span>
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </article>
  )
}

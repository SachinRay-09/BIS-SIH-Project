// BIS Sarathi — Complaint Journey Component
// Displays the complaint preparation flow for consumers reporting an ISI-marked product.
// Sourced from the PROMPT_COMPLAINT seeded response.
//
// Layout:
//   Page header  — title, demo mode notice
//   Section 1    — assistantMessage explaining the complaint preparation process
//   Section 2    — ComplaintDraftCard with all complaint fields (extracted + missing)
//   Section 3    — What happens next (review and official channel guidance)
//
// CRITICAL CONSTRAINTS (Requirements 8.1–8.5, 8.7, 8.8):
//   - "Submit to BIS" MUST NOT appear anywhere in this component —
//     not in headings, body text, button labels, or aria labels.
//   - The external action CTA is labelled "Open BIS Care Portal →".
//   - This component never submits any data to any external service.
//
// Server component — no 'use client' directive needed.
// Requirements: 8.1, 8.2, 8.3, 8.4, 8.5

import Link from 'next/link'
import { responses } from '@/data/responses'
import { ComplaintDraftCard } from '@/components/cards/ComplaintDraftCard'

// ─────────────────────────────────────────────────────────────────────────────
// Resolve response data at module load time (server component — synchronous)
// ─────────────────────────────────────────────────────────────────────────────

const COMPLAINT_RESPONSE = responses['PROMPT_COMPLAINT']

// ─────────────────────────────────────────────────────────────────────────────
// What-happens-next steps — sourced from design, not fabricated
// ─────────────────────────────────────────────────────────────────────────────

const NEXT_STEPS = [
  {
    step: 1,
    heading: 'Review the draft',
    detail:
      'Check all extracted fields. Provide any missing information (licence/ISI mark number, purchase details) to complete the draft.',
  },
  {
    step: 2,
    heading: 'Confirm your complaint',
    detail:
      'Read through the structured draft before taking any action. No information is sent anywhere until you choose to act.',
  },
  {
    step: 3,
    heading: 'Open the official BIS Care channel',
    detail:
      'Navigate to the official BIS Care portal using the link provided and submit your complaint through the official government channel.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `ComplaintJourney` renders the consumer complaint preparation flow.
 *
 * It pulls the `PROMPT_COMPLAINT` seeded response for the explanation text
 * and the complaint fields, renders a `ComplaintDraftCard` with those fields,
 * and provides guidance on the next steps — routing to the official BIS Care
 * portal as the external action. "Submit to BIS" never appears anywhere
 * in this component.
 *
 * @example
 * <ComplaintJourney />
 */
export function ComplaintJourney() {
  const complaintFields = COMPLAINT_RESPONSE.complaintFields ?? []

  return (
    <div className="flex flex-col gap-10">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Complaint / alert icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1B2A4A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Complaint Preparation</h1>
        </div>
        <p className="text-[#64748B] text-sm max-w-prose">
          Sarathi helps you structure a complaint about a product carrying an ISI mark.
          You review the draft — all submission is done through the official BIS Care channel.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#B45309] font-medium">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#B45309]"
            aria-hidden="true"
          />
          Demo mode — complaint fields pre-populated from seeded demo query
        </div>
      </header>

      {/* ── Section 1: Process explanation ───────────────────────────────── */}
      <section aria-labelledby="section-process-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              1
            </span>
            <h2
              id="section-process-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              How complaint preparation works
            </h2>
          </div>

          {/* assistantMessage from PROMPT_COMPLAINT response */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <p className="text-sm text-[#1A1A2E] leading-relaxed">
              {COMPLAINT_RESPONSE.assistantMessage}
            </p>
          </div>

          {/* Grounding notice — Requirement 8.4 */}
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-md text-xs"
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              color: '#92400E',
            }}
            role="note"
            aria-label="Draft review notice"
          >
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-sm">⚠</span>
            <span>
              <strong>AI prepares the draft. The user reviews and confirms before any official action.</strong>{' '}
              No data is sent to BIS or any external service by this application.
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 2: Complaint draft card ──────────────────────────────── */}
      <section aria-labelledby="section-draft-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              2
            </span>
            <h2
              id="section-draft-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              Extracted complaint fields
            </h2>
          </div>

          <p className="text-sm text-[#64748B]">
            The fields below were extracted from the demo query. Missing fields are highlighted in amber —
            these must be provided before a complete draft can be prepared.
          </p>

          {/* ComplaintDraftCard — Requirements 8.1, 8.2, 8.3, 8.5, 8.7, 8.8 */}
          <ComplaintDraftCard fields={complaintFields} />
        </div>
      </section>

      {/* ── Section 3: What happens next ─────────────────────────────────── */}
      <section aria-labelledby="section-next-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              3
            </span>
            <h2
              id="section-next-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              What happens next
            </h2>
          </div>

          <ol className="flex flex-col gap-3" aria-label="Next steps for complaint submission">
            {NEXT_STEPS.map(({ step, heading, detail }) => (
              <li
                key={step}
                className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-start gap-4"
              >
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#1B2A4A] text-[#1B2A4A] text-xs font-bold shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {step}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#1B2A4A]">{heading}</span>
                  <span className="text-sm text-[#64748B] leading-relaxed">{detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA section ──────────────────────────────────────────────────── */}
      <section
        className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-4"
        aria-labelledby="section-cta-heading"
      >
        <div className="flex items-start gap-3">
          {/* Info / official action icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF671F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex flex-col gap-1">
            <h2
              id="section-cta-heading"
              className="text-sm font-semibold text-[#1B2A4A]"
            >
              Ready to act?
            </h2>
            <p className="text-sm text-[#64748B]">
              Once you have reviewed the draft and provided the missing fields, use the BIS Care portal
              to formally lodge your complaint with the Bureau of Indian Standards.
            </p>
          </div>
        </div>

        {/* Action buttons — "Submit to BIS" NEVER appears here */}
        <div className="flex flex-wrap gap-3">
          {/* Primary: Open BIS Care Portal — Requirement 8.5, 8.6 */}
          <a
            href="https://www.bis.gov.in/index.php/bis-care/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open BIS Care Portal (opens in new tab)"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#FF671F] hover:bg-[#E05A17] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF671F] focus-visible:ring-offset-2"
          >
            Open BIS Care Portal
            <span aria-hidden="true">→</span>
            <span className="sr-only">(opens in new tab)</span>
          </a>

          {/* Secondary: Ask Sarathi in chat */}
          <Link
            href="/ask"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-[#1B2A4A] border border-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2"
          >
            Ask Sarathi in chat
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

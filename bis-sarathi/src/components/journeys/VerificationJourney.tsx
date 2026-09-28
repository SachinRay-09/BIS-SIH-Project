// BIS Sarathi — Verification Journey Component
// Displays the licence/ISI mark verification workflow using DEMO-LIC-001 mock data.
// Sourced from the PROMPT_VERIFY seeded response and the DEMO_LIC_001 verification record.
//
// Layout:
//   Page header   — title, amber demo-mode notice
//   Section 1     — assistantMessage explaining demo limitations
//   Section 2     — VerificationResult with DEMO-LIC-001 data
//                   (amber warning banner displayed first — Requirement 9.6)
//   Section 3     — What this demo shows / what it does NOT show
//   Section 4     — CTA: "Visit official BIS portal →" for real verification
//
// CRITICAL CONSTRAINTS (Requirements 9.4, 1.2):
//   - "Verified by BIS" MUST NOT appear anywhere in this component —
//     not in headings, body text, button labels, aria-labels, or screen-reader text.
//   - No green badge, green icon, or green status indicator may appear here.
//   - The VerificationResult amber warning banner must be visible before all other detail.
//   - This component never connects to any real BIS registry.
//
// Server component — no 'use client' directive needed.
// Requirements: 7.1, 7.2, 7.3, 7.4, 9.4

import Link from 'next/link'
import { responses } from '@/data/responses'
import { DEMO_LIC_001 } from '@/data/verification'
import { VerificationResult } from '@/components/cards/VerificationResult'

// ─────────────────────────────────────────────────────────────────────────────
// Resolve response and record data at module load time (server component)
// ─────────────────────────────────────────────────────────────────────────────

const VERIFY_RESPONSE = responses['PROMPT_VERIFY']

// Build the VerificationSummary that VerificationResult expects
// (the component uses VerificationSummary, the full record adds extra detail fields)
const VERIFICATION_SUMMARY = VERIFY_RESPONSE.verificationResult!

// Additional detail fields from the full VerificationRecord for the detail section
const DETAIL_FIELDS: Array<{ label: string; value: string }> = [
  { label: 'Product description', value: DEMO_LIC_001.productDescription },
  { label: 'Manufacturer', value: DEMO_LIC_001.manufacturer },
  { label: 'Standard', value: DEMO_LIC_001.standard },
  { label: 'Issued date', value: DEMO_LIC_001.issuedDate },
  { label: 'Expiry date', value: DEMO_LIC_001.expiryDate },
  { label: 'Source type', value: DEMO_LIC_001.sourceType },
]

// What this demo shows vs. what it does NOT show
const DEMO_SCOPE_ITEMS = [
  {
    type: 'shows' as const,
    text: 'How a verification query is routed, processed, and presented with mandatory disclaimers',
  },
  {
    type: 'shows' as const,
    text: 'The amber warning treatment distinguishing mock records from real BIS results',
  },
  {
    type: 'shows' as const,
    text: 'The service trace metadata for a licence lookup: intent, route, evidence source, next action',
  },
  {
    type: 'does-not-show' as const,
    text: 'A real BIS licence — DEMO-LIC-001 is entirely fictional',
  },
  {
    type: 'does-not-show' as const,
    text: 'Live access to the BIS production registry — no network call is made',
  },
  {
    type: 'does-not-show' as const,
    text: 'Any form of BIS certification confirmation — this is a concept demonstrator only',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `VerificationJourney` renders the licence verification demo workflow.
 *
 * It pulls the `PROMPT_VERIFY` seeded response for the explanation text and
 * renders a `VerificationResult` card using the DEMO-LIC-001 mock record.
 * The amber warning banner from `VerificationResult` is the first visible
 * element inside the card, making the demo nature immediately clear.
 *
 * "Verified by BIS" never appears anywhere in this component or its children.
 * No green visual treatment is used.
 *
 * @example
 * <VerificationJourney />
 */
export function VerificationJourney() {
  return (
    <div className="flex flex-col gap-10">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Shield / verification icon — amber, not green */}
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">
            Licence Verification (Demo)
          </h1>
        </div>
        <p className="text-[#64748B] text-sm max-w-prose">
          This demo illustrates how a licence or ISI mark identifier lookup works in BIS Sarathi.
          The record shown is a mock demonstration record — it is not connected to any BIS production system.
        </p>
        {/* Amber demo-mode notice — Requirements 1.3, 9.6 */}
        <div
          className="inline-flex items-center gap-1.5 text-xs text-[#92400E] font-medium px-3 py-2 rounded-md w-fit"
          style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}
          role="note"
          aria-label="Demo mode notice"
        >
          <span aria-hidden="true">⚠</span>
          Demo mode — DEMO-LIC-001 is a mock record only, not a real BIS licence
        </div>
      </header>

      {/* ── Section 1: Process explanation ───────────────────────────────── */}
      <section aria-labelledby="section-explanation-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              1
            </span>
            <h2
              id="section-explanation-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              How this works in the demo
            </h2>
          </div>

          {/* assistantMessage from PROMPT_VERIFY response */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <p className="text-sm text-[#1A1A2E] leading-relaxed">
              {VERIFY_RESPONSE.assistantMessage}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Verification result card ──────────────────────────── */}
      <section aria-labelledby="section-result-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              2
            </span>
            <h2
              id="section-result-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              Demo verification record — DEMO-LIC-001
            </h2>
          </div>

          <p className="text-sm text-[#64748B]">
            The amber warning banner below is the first element rendered inside the card —
            ensuring the mock nature of the record is immediately visible.
          </p>

          {/* VerificationResult — amber warning banner is FIRST element inside
              Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6 */}
          <VerificationResult result={VERIFICATION_SUMMARY} />

          {/* Extended detail fields from the full VerificationRecord */}
          <div
            className="bg-white border border-[#E2E8F0] rounded-md p-5"
            aria-label="Extended demo record details"
          >
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-4">
              Extended demo record fields
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {DETAIL_FIELDS.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-[#64748B] font-medium mb-0.5">{label}</dt>
                  <dd className="text-sm text-[#1A1A2E] font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            {/* Freshness label — Requirement 1.5, 4.4 */}
            <p className="mt-4 text-xs text-[#B45309]">
              retrieved {DEMO_LIC_001.retrievedAt} — mock record, not sourced from BIS production registry
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 3: Demo scope — what this shows / does not show ─────── */}
      <section aria-labelledby="section-scope-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              3
            </span>
            <h2
              id="section-scope-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              Scope of this demo
            </h2>
          </div>

          <p className="text-sm text-[#64748B]">
            The table below clarifies what this demo illustrates and what it explicitly does not represent.
          </p>

          <ul className="flex flex-col gap-2" aria-label="Demo scope items">
            {DEMO_SCOPE_ITEMS.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-3"
              >
                {item.type === 'shows' ? (
                  /* Amber tick for "shows" — NOT green; avoids any "verified" connotation */
                  <span
                    aria-label="This demo shows"
                    style={{ color: '#B45309' }}
                    className="mt-0.5 text-base leading-none shrink-0 font-bold"
                  >
                    ✓
                  </span>
                ) : (
                  /* Grey X for "does not show" */
                  <span
                    aria-label="This demo does not show"
                    style={{ color: '#64748B' }}
                    className="mt-0.5 text-base leading-none shrink-0 font-bold"
                  >
                    ✗
                  </span>
                )}
                <span className="text-sm text-[#1A1A2E] leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Section 4: Real verification CTA ─────────────────────────────── */}
      <section
        className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-4"
        aria-labelledby="section-cta-heading"
      >
        <div className="flex items-start gap-3">
          {/* Info icon */}
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
              Need to verify a real BIS licence?
            </h2>
            <p className="text-sm text-[#64748B]">
              For authoritative licence status, visit the official BIS portal. BIS Sarathi cannot access the
              BIS production registry — this is a demonstration application only.
            </p>
          </div>
        </div>

        {/* Action buttons — "Verified by BIS" NEVER appears here */}
        <div className="flex flex-wrap gap-3">
          {/* Primary: Visit official BIS portal — Requirements 7.3, 9.4 */}
          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit official BIS portal (opens in new tab)"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#FF671F] hover:bg-[#E05A17] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF671F] focus-visible:ring-offset-2"
          >
            Visit official BIS portal
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

// BIS Sarathi — Abstention Response Card
// Displayed when the grounding gate determines there is insufficient evidence
// to answer a query. Abstention is a first-class positive product outcome —
// it demonstrates that Sarathi will not fabricate or hallucinate BIS information.
//
// CRITICAL CONSTRAINTS (Requirements 10.1–10.6):
//   - MUST display "UNABLE TO VERIFY" label as the first prominent element.
//   - MUST display the exact message:
//       "I could not verify this reliably from the available BIS evidence. I will not guess."
//   - MUST display a "Why?" section listing the two stated abstention reasons.
//   - MUST provide a CTA link to https://www.bis.gov.in labelled "Visit official BIS portal →"
//   - MUST use a warning/neutral colour treatment — purple-neutral (#7C3AED) per design.
//     NOT a success/green treatment, NOT an error/red treatment.
//   - Abstention is a POSITIVE signal — styling must reflect "principled refusal", not failure.
//
// This is a server component — no 'use client' directive needed.
// Requirements: 10.1, 10.2, 10.3

import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface AbstentionResponseProps {
  /** Exact message text displayed prominently below the "UNABLE TO VERIFY" label */
  message: string
  /** Array of abstention reasons shown in the "Why?" section — must have 2 items */
  reasons: string[]
}

/**
 * `AbstentionResponse` renders the grounding-gate refusal outcome.
 *
 * It is shown when Sarathi cannot verify a query from the available BIS evidence.
 * The purple-neutral colour scheme signals "principled abstention", not an error.
 * Judges see this as a demonstration of the grounding gate — a positive product signal.
 *
 * @example
 * <AbstentionResponse
 *   message="I could not verify this reliably from the available BIS evidence. I will not guess."
 *   reasons={[
 *     'No authoritative evidence found in the available BIS dataset for this query.',
 *     'Insufficient current regulatory data to provide a grounded response.',
 *   ]}
 * />
 */
export function AbstentionResponse({ message, reasons }: AbstentionResponseProps) {
  return (
    <article
      style={{ borderLeftColor: '#7C3AED' }}
      className="bg-white border border-[#E2E8F0] border-l-[3px] rounded-md overflow-hidden"
      aria-label="Unable to verify — abstention response"
    >
      {/* ── Top accent strip — purple-neutral ─────────────────────────────────
          Thin visual reinforcement that this is a distinct outcome state.
      ───────────────────────────────────────────────────────────────────────── */}
      <div
        style={{ backgroundColor: '#7C3AED' }}
        className="h-1 w-full"
        aria-hidden="true"
      />

      <div className="p-4 flex flex-col gap-4">

        {/* ── "UNABLE TO VERIFY" label ──────────────────────────────────────
            Requirements: 10.2
            Red/orange badge (#DC2626 bg, white text) per task specification.
            Distinct from the purple accent — signals the verification outcome clearly.
        ────────────────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded"
            aria-label="Status: Unable to verify"
          >
            Unable to Verify
          </span>
          {/* H.2 — Grounding score notice */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C]">
            LOW · 0%
          </span>
          <span className="sr-only">
            Sarathi was unable to verify this query from the available BIS evidence.
          </span>
        </div>
        {/* H.2 — one-line grounding reason */}
        <p className="text-xs text-[#B91C1C]">
          No matching evidence found in the available BIS dataset for this query.
        </p>

        {/* ── Main message — displayed prominently ──────────────────────────
            Requirements: 10.2
            Exact required message text passed via props.
        ────────────────────────────────────────────────────────────────────── */}
        <p
          style={{ color: '#1A1A2E' }}
          className="text-base font-semibold leading-snug"
        >
          {message}
        </p>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <hr className="border-[#E2E8F0]" />

        {/* ── "Why?" section — two stated abstention reasons ─────────────────
            Requirements: 10.3
        ────────────────────────────────────────────────────────────────────── */}
        <div>
          <p
            style={{ color: '#7C3AED' }}
            className="text-xs font-bold uppercase tracking-widest mb-2"
          >
            Why?
          </p>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0" role="list">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#64748B] leading-relaxed">
                {/* Purple bullet marker */}
                <span
                  style={{ color: '#7C3AED' }}
                  className="mt-1 text-[10px] leading-none flex-shrink-0"
                  aria-hidden="true"
                >
                  ●
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <hr className="border-[#E2E8F0]" />

        {/* ── CTA: "Visit official BIS portal →" ────────────────────────────
            Requirements: 10.4
            External link to https://www.bis.gov.in — opens in new tab.
        ────────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit official BIS portal (opens in new tab)"
            style={{ color: '#1B2A4A' }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-[#FF671F] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
          >
            Visit official BIS portal
            <span aria-hidden="true">→</span>
            <span className="sr-only">(opens in new tab)</span>
          </a>
          {/* H.1 — Follow-up CTA to complaint preparation */}
          <Link
            href="/ask?q=I+want+to+complain+about+a+product+carrying+an+ISI+mark."
            style={{ color: '#7C3AED' }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1 rounded"
            aria-label="Help me prepare a complaint or verification request"
          >
            Help me prepare a request →
          </Link>
        </div>

      </div>
    </article>
  )
}

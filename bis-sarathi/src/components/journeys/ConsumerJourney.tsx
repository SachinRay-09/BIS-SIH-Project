// BIS Sarathi — Consumer Journey Component
// Displays a plain-language explanation of IS 14543 for consumers,
// sourced from the PROMPT_WHAT_IS_14543 seeded response.
//
// Layout:
//   Section 1 — Plain-language explanation (assistantMessage from PROMPT_WHAT_IS_14543)
//   Section 2 — What the ISI mark means (what to look for as a consumer)
//   Section 3 — Evidence records (EvidenceCard for each ID in evidenceCards)
//   Section 4 — CTA: "Have a complaint?" → links to /ask
//
// Server component — no client state required.
// Requirements: 6.1, 6.2

import Link from 'next/link'
import { responses } from '@/data/responses'
import { evidenceRecords } from '@/data/evidence'
import { EvidenceCard } from '@/components/cards/EvidenceCard'
import { VerifyISIEntry } from '@/components/VerifyISIEntry'

// ─────────────────────────────────────────────────────────────────────────────
// Resolve response data at module load time (server component — synchronous)
// ─────────────────────────────────────────────────────────────────────────────

const CONSUMER_RESPONSE = responses['PROMPT_WHAT_IS_14543']

const resolvedEvidenceCards = (CONSUMER_RESPONSE.evidenceCards ?? [])
  .map((id) => evidenceRecords.find((r) => r.id === id))
  .filter((r): r is NonNullable<typeof r> => r !== undefined)

// Plain-language breakdown of consumer-relevant IS 14543 aspects
const STANDARD_HIGHLIGHTS = [
  {
    icon: '💧',
    label: 'Water quality',
    detail:
      'Sets limits on pH, dissolved solids, and heavy metals to ensure the water is safe for drinking.',
  },
  {
    icon: '🦠',
    label: 'Microbiological safety',
    detail:
      'Requires the water to be free from bacteria, pathogens, and other harmful microorganisms.',
  },
  {
    icon: '🏷️',
    label: 'Packaging & labelling',
    detail:
      'Specifies what information the manufacturer must print on the bottle, jar, or pouch.',
  },
  {
    icon: '✅',
    label: 'ISI mark',
    detail:
      'Any packaged drinking water sold in India must carry the ISI mark — proof that BIS has certified it.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `ConsumerJourney` renders the consumer-facing explanation page for IS 14543.
 *
 * It pulls the `PROMPT_WHAT_IS_14543` seeded response for the main explanation
 * text, resolves evidence record IDs to full `EvidenceRecord` objects, and
 * displays an actionable CTA linking to the chat interface for complaint help.
 *
 * @example
 * <ConsumerJourney />
 */
export function ConsumerJourney() {
  return (
    <div className="flex flex-col gap-10">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Consumer / person icon */}
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Consumer Guide</h1>
        </div>
        <p className="text-[#64748B] text-sm max-w-prose">
          Understand what the ISI mark on packaged drinking water means, and know your rights as a consumer.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#B45309] font-medium">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#B45309]"
            aria-hidden="true"
          />
          Demo mode — IS 14543 (Packaged Drinking Water) hardcoded for this demonstration
        </div>
      </header>

      {/* ── Section 1: Plain-language explanation ────────────────────────── */}
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
              What is IS 14543?
            </h2>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <p className="text-sm text-[#1A1A2E] leading-relaxed">
              {CONSUMER_RESPONSE.assistantMessage}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Standard highlights ──────────────────────────────── */}
      <section aria-labelledby="section-highlights-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              2
            </span>
            <h2
              id="section-highlights-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              What the standard covers
            </h2>
          </div>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            aria-label="IS 14543 coverage areas"
          >
            {STANDARD_HIGHLIGHTS.map((item) => (
              <li
                key={item.label}
                className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-start gap-3"
              >
                <span
                  className="text-xl leading-none mt-0.5"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#1B2A4A]">
                    {item.label}
                  </span>
                  <span className="text-sm text-[#64748B] leading-relaxed">
                    {item.detail}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Sourcing notice */}
          <p className="text-xs text-[#64748B] italic">
            Information sourced from publicly available BIS documentation.
            Consult the official BIS website for authoritative requirements.
          </p>
        </div>
      </section>

      {/* ── F.2 — What the ISI mark means for you ───────────────────────── */}
      <section aria-labelledby="section-isi-meaning-heading">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">3</span>
            <h2 id="section-isi-meaning-heading" className="text-base font-semibold text-[#1B2A4A]">
              What the ISI mark means for you
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '✅', title: 'Minimum safety standards met', body: 'The product has been tested and certified to meet BIS quality and safety requirements under the applicable Indian Standard.' },
              { icon: '🏛️', title: 'Manufacturer is BIS-licensed', body: 'The manufacturer holds a valid BIS licence and is authorised to use the ISI mark on this product category.' },
              { icon: '📢', title: "You can complain if quality doesn't match", body: 'If a product carrying the ISI mark does not meet the standards, you have the right to raise a complaint through the official BIS Care channel.' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex flex-col gap-2">
                <span className="text-xl" aria-hidden="true">{item.icon}</span>
                <p className="text-sm font-semibold text-[#1B2A4A]">{item.title}</p>
                <p className="text-xs text-[#64748B] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── F.1 — Verify ISI mark entry ──────────────────────────────────── */}
      <section aria-labelledby="section-verify-heading">
        <div className="flex flex-col gap-4 bg-white border border-[#E2E8F0] rounded-lg p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">4</span>
            <h2 id="section-verify-heading" className="text-base font-semibold text-[#1B2A4A]">
              Verify an ISI mark or licence number
            </h2>
          </div>
          <p className="text-sm text-[#64748B]">
            Enter a licence number or HUID to check it against the demo verification records. In production, this would query the official BIS licence registry.
          </p>
          <VerifyISIEntry />
        </div>
      </section>

      {/* ── Section 5: Evidence records ──────────────────────────────────── */}
      {resolvedEvidenceCards.length > 0 && (
        <section aria-labelledby="section-evidence-heading">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
                5
              </span>
              <h2
                id="section-evidence-heading"
                className="text-base font-semibold text-[#1B2A4A]"
              >
                Evidence
              </h2>
            </div>

            <p className="text-sm text-[#64748B]">
              The records below are the sources used to generate this explanation.
            </p>

            <div className="flex flex-col gap-3">
              {resolvedEvidenceCards.map((record) => (
                <EvidenceCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Complaint CTA ──────────────────────────────────────── */}
      <section
        className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-3"
        aria-labelledby="section-complaint-heading"
      >
        <div className="flex items-start gap-3">
          {/* Warning / complaint icon */}
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="flex flex-col gap-1">
            <h2
              id="section-complaint-heading"
              className="text-sm font-semibold text-[#1B2A4A]"
            >
              Have a complaint about a product?
            </h2>
            <p className="text-sm text-[#64748B]">
              If you have purchased packaged drinking water that you believe does not meet BIS quality
              standards, or carries an ISI mark you suspect is invalid, Sarathi can help you prepare
              a structured complaint to submit through the official BIS Care channel.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/ask"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#FF671F] hover:bg-[#E05A17] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF671F] focus-visible:ring-offset-2"
            aria-label="Ask Sarathi to help prepare a complaint"
          >
            Ask Sarathi for help
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href="https://www.bis.gov.in/index.php/consumer/bis-care/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open BIS Care complaint portal (opens in new tab)"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-[#1B2A4A] border border-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2"
          >
            Open BIS Care
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </section>
    </div>
  )
}

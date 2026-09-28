// BIS Sarathi — Industry Journey Component
// Guided demo flow for industry users / MSMEs seeking BIS standards compliance.
//
// Three-section layout (all rendered after the user clicks "Find Standard"):
//   Section 1 — "Your Product"   : text input pre-filled with "packaged drinking water"
//   Section 2 — "Matched Standard": ProductUnderstandingCard + CandidateStandardCard(s)
//   Section 3 — "Testing Laboratories": LabCard list for IS 14543
//
// Hardcoded to IS 14543 for the demo.
// Runs LoadingSequence after "Find Standard" is clicked before revealing results.
//
// Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8

'use client'

import { useState, useRef, useEffect } from 'react'
import { ProductUnderstandingCard } from '@/components/cards/ProductUnderstandingCard'
import { CandidateStandardCard } from '@/components/cards/CandidateStandardCard'
import { LabCard } from '@/components/cards/LabCard'
import { EvidenceCard } from '@/components/cards/EvidenceCard'
import LoadingSequence from '@/components/chat/LoadingSequence'
import type { ProductUnderstanding, CandidateStandard } from '@/lib/types'
import { labs } from '@/data/labs'
import { evidenceRecords } from '@/data/evidence'

// ─────────────────────────────────────────────────────────────────────────────
// Static demo data (IS 14543, hardcoded for the demo)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_PRODUCT_UNDERSTANDING: ProductUnderstanding = {
  product: 'Packaged Drinking Water',
  category: 'Packaged Food / Beverages',
  use: 'Direct human consumption',
  matchReasons: [
    'Product-category match: "packaged drinking water" maps directly to the BIS WRD category',
    'Packaging/use match: sealed containers for direct consumption',
    'Mandatory certification flag: CRS applies to this product category',
  ],
}

const DEMO_CANDIDATE_STANDARDS: CandidateStandard[] = [
  {
    standardId: 'IS-14543-2024',
    standardNumber: 'IS 14543',
    title: 'Packaged Drinking Water (other than Packaged Natural Mineral Water)',
    year: 2024,
    versionNotes:
      '2024 record found — current in-force revision (4th Revision). ' +
      'Mandatory under the Compulsory Registration Scheme (CRS). ' +
      'Supersedes the 2016 (3rd Revision) edition.',
    matchReasons: [
      'Exact product-category match: IS 14543 covers packaged drinking water for direct consumption',
      'Current revision: 2024 edition is the in-force standard',
      'Certification scheme match: CRS applies — ISI mark required for sale in India',
      'BIS source record: official public-source snapshot retrieved 28 Sep 2026',
    ],
    applicabilityStatus: 'verified',
    clarificationsNeeded: [
      'Confirm the intended container capacity range (e.g. 200 ml pouches vs 20 L jars may have different packaging requirements)',
      'Confirm whether the product is natural mineral water — if yes, IS 13428 applies instead of IS 14543',
    ],
  },
  {
    standardId: 'IS-14543-2016',
    standardNumber: 'IS 14543',
    title: 'Packaged Drinking Water (other than Packaged Natural Mineral Water)',
    year: 2016,
    versionNotes:
      'Earlier 2016 record also found (3rd Revision) — superseded by 2024 edition. ' +
      'Products tested under the 2016 edition may require re-testing against the 2024 revision.',
    matchReasons: [
      'Same product category as IS 14543:2024 — prior revision, now superseded',
      'Surfaced to demonstrate version-awareness for manufacturers with existing certification',
      'Version metadata available: both 2024 and 2016 records found in the evidence dataset',
    ],
    applicabilityStatus: 'candidate',
    clarificationsNeeded: [
      'Confirm whether your current BIS licence was issued under the 2016 revision — if so, check with BIS whether re-testing is required under the 2024 edition',
    ],
  },
]

// Evidence record IDs to display for IS 14543
const IS_14543_EVIDENCE_IDS = ['EVD-STD-IS14543-2024', 'EVD-STD-IS14543-2016']

// D.1 — Product attribute schema (SIH v2 § 8.2)
const DEMO_PRODUCT_ATTRIBUTES = [
  { label: 'Product type', value: 'Packaged Drinking Water' },
  { label: 'Material', value: 'PET / HDPE / Polycarbonate containers' },
  { label: 'Intended use', value: 'Direct human consumption' },
  { label: 'Market context', value: 'Retail sale in India — mandatory certification' },
  { label: 'HSN code', value: '2201 (Waters, not sweetened/flavoured)' },
]

// D.2 — Clarifications still needed (seeded)
const WHAT_STILL_NEEDED = [
  'Confirm container capacity range (e.g. 200 ml pouches vs 20 L jars)',
  'Confirm whether the product is natural mineral water (if yes, IS 13428 applies)',
]

// Regulatory guidance sourced only from seeded data — no fabricated clause numbers
const CERTIFICATION_GUIDANCE = {
  scheme: 'Compulsory Registration Scheme (CRS)',
  mark: 'ISI Mark',
  body: 'Bureau of Indian Standards (BIS)',
  overview:
    'IS 14543 is a mandatory standard under the BIS Compulsory Registration Scheme (CRS). ' +
    'Manufacturers must obtain a BIS licence to use the ISI mark on packaged drinking water products before sale in India.',
  steps: [
    'Apply for a BIS licence via the BIS online portal (manakonline.in)',
    'Submit product samples to a BIS-recognised laboratory for testing against IS 14543',
    'Obtain a test report confirming conformance to IS 14543 requirements',
    'BIS reviews the application and, if satisfactory, grants the CRS licence',
    'Display the ISI mark with licence number on all product containers as required',
  ],
  notice:
    'This guidance is sourced from publicly available BIS documentation. ' +
    'Consult the official BIS website and BIS officers for authoritative certification requirements. ' +
    'No clause numbers or regulatory obligations beyond what is present in the seeded dataset are stated here.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `IndustryJourney` is a guided demo flow for industry users and MSMEs.
 *
 * The user can edit the product input (pre-filled with "packaged drinking water"),
 * then click "Find Standard" to trigger the animated loading sequence. Once the
 * sequence completes, the results sections are revealed:
 *
 * 1. Product Understanding — what Sarathi understood from the query
 * 2. Matched Standard — IS 14543:2024 (current) and IS 14543:2016 (earlier revision)
 * 3. Certification & Regulatory Guidance — sourced only from seeded data
 * 4. Evidence Cards — provenance for the records used
 * 5. Testing Laboratories — lab cards from the public BIS LIMS snapshot
 *
 * @example
 * <IndustryJourney />
 */
export function IndustryJourney() {
  const [productInput, setProductInput] = useState('packaged drinking water')
  const [phase, setPhase] = useState<'idle' | 'loading' | 'results'>('idle')
  const resultsRef = useRef<HTMLDivElement>(null)

  // Resolve evidence records at render time
  const evidenceForDisplay = IS_14543_EVIDENCE_IDS
    .map((id) => evidenceRecords.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => r !== undefined)

  function handleFindStandard() {
    if (phase === 'loading') return
    setPhase('loading')
  }

  function handleLoadingComplete() {
    setPhase('results')
  }

  // Move focus to results after they appear
  useEffect(() => {
    if (phase === 'results' && resultsRef.current) {
      resultsRef.current.focus()
    }
  }, [phase])

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Factory / Industry icon */}
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
            <path d="M2 20v-8l7-7 7 7v8" />
            <path d="M10 20v-4h4v4" />
            <path d="M2 20h20" />
            <path d="M16 13v7" />
            <path d="M19 13l3 3-3 3" />
          </svg>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Industry / MSME Journey</h1>
        </div>
        <p className="text-[#64748B] text-sm max-w-prose">
          Find the right BIS standard for your product, understand your certification obligations,
          and discover accredited testing laboratories — all from publicly available BIS sources.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#B45309] font-medium">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#B45309]"
            aria-hidden="true"
          />
          Demo mode — IS 14543 (Packaged Drinking Water) hardcoded for this demonstration
        </div>
      </header>

      {/* ── Section 1: Your Product ───────────────────────────────────────── */}
      <section aria-labelledby="section-product-heading">
        <div className="flex flex-col gap-4 bg-white border border-[#E2E8F0] rounded-lg p-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
              1
            </span>
            <h2
              id="section-product-heading"
              className="text-base font-semibold text-[#1B2A4A]"
            >
              Your Product
            </h2>
          </div>

          <p className="text-sm text-[#64748B]">
            Describe the product you manufacture or plan to manufacture.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="product-input" className="sr-only">
              Product description
            </label>
            <input
              id="product-input"
              type="text"
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              placeholder="e.g. packaged drinking water"
              className="flex-1 px-3 py-2 text-sm border border-[#E2E8F0] rounded-md text-[#1A1A2E] bg-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
              aria-label="Product description"
              disabled={phase === 'loading'}
            />
            <button
              type="button"
              onClick={handleFindStandard}
              disabled={phase === 'loading' || productInput.trim() === ''}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#243859] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Find BIS standard for this product"
            >
              {phase === 'loading' ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Searching…
                </>
              ) : (
                <>
                  Find Standard
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>

          {/* Reset button — only show once results are visible */}
          {phase === 'results' && (
            <button
              type="button"
              onClick={() => {
                setPhase('idle')
                setProductInput('packaged drinking water')
              }}
              className="self-start text-xs text-[#64748B] hover:text-[#1B2A4A] underline underline-offset-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      {/* ── Loading sequence ─────────────────────────────────────────────── */}
      {phase === 'loading' && (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
          <LoadingSequence onComplete={handleLoadingComplete} />
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {phase === 'results' && (
        <div
          ref={resultsRef}
          tabIndex={-1}
          className="flex flex-col gap-8 focus:outline-none"
          aria-live="polite"
          aria-label="Industry journey results"
        >
          {/* ── Section 2: Product Understanding + Matched Standard ───────── */}
          <section aria-labelledby="section-matched-heading">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
                  2
                </span>
                <h2
                  id="section-matched-heading"
                  className="text-base font-semibold text-[#1B2A4A]"
                >
                  Matched Standard
                </h2>
              </div>

              {/* Product Understanding */}
              <ProductUnderstandingCard data={DEMO_PRODUCT_UNDERSTANDING} />

              {/* D.1 — Product attribute schema card */}
              <div className="bg-white border border-[#E2E8F0] rounded-md p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] mb-3">
                  Extracted product attributes
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {DEMO_PRODUCT_ATTRIBUTES.map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">{label}</dt>
                      <dd className="text-xs text-[#334155]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* D.3 — Mandatory vs Candidate notice */}
              <div className="rounded-md border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3 text-xs text-[#1D4ED8]">
                <p className="font-semibold mb-1">Understanding applicability labels</p>
                <ul className="flex flex-col gap-1">
                  <li><span className="font-semibold text-[#15803D]">Verified applicable</span> — confirmed match with evidence; CRS mandatory for this product.</li>
                  <li><span className="font-semibold text-[#1D4ED8]">Candidate</span> — semantically similar; requires verification before acting on it.</li>
                  <li><span className="font-semibold text-[#854D0E]">Uncertain</span> — weak or conflicting signals; treat with caution and consult BIS directly.</li>
                </ul>
                <p className="mt-1.5 text-[#1D4ED8] opacity-70">
                  "Candidate standard" is not the same as "legally applicable standard." Evidence decides.
                </p>
              </div>

              {/* Candidate Standard cards */}
              <div className="flex flex-col gap-3">
                {DEMO_CANDIDATE_STANDARDS.map((std) => (
                  <CandidateStandardCard key={std.standardId} standard={std} />
                ))}
              </div>

              {/* D.2 — What I still need (page-level summary) */}
              <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B45309] mb-2">
                  What I still need to fully ground this recommendation
                </p>
                <ul className="flex flex-col gap-1.5">
                  {WHAT_STILL_NEEDED.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-xs text-[#92400E]">
                      <span className="mt-0.5 flex-shrink-0" aria-hidden="true">?</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Section 3: Certification & Regulatory Guidance ───────────── */}
          <section aria-labelledby="section-certification-heading">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
                  3
                </span>
                <h2
                  id="section-certification-heading"
                  className="text-base font-semibold text-[#1B2A4A]"
                >
                  Certification &amp; Regulatory Guidance
                </h2>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-4">
                {/* Scheme + mark row */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
                      Certification Scheme
                    </span>
                    <span className="text-sm font-medium text-[#1A1A2E]">
                      {CERTIFICATION_GUIDANCE.scheme}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
                      Mark Required
                    </span>
                    <span className="text-sm font-medium text-[#1A1A2E]">
                      {CERTIFICATION_GUIDANCE.mark}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
                      Issuing Body
                    </span>
                    <span className="text-sm font-medium text-[#1A1A2E]">
                      {CERTIFICATION_GUIDANCE.body}
                    </span>
                  </div>
                </div>

                {/* Overview */}
                <p className="text-sm text-[#1A1A2E] leading-relaxed">
                  {CERTIFICATION_GUIDANCE.overview}
                </p>

                {/* Certification steps */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
                    Typical certification steps
                  </span>
                  <ol className="flex flex-col gap-2 pl-1" aria-label="Certification steps">
                    {CERTIFICATION_GUIDANCE.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1A1A2E]">
                        <span
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-bold shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Sourcing notice */}
                <p className="text-xs text-[#64748B] italic border-t border-[#E2E8F0] pt-3">
                  {CERTIFICATION_GUIDANCE.notice}
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 4: Evidence Cards ─────────────────────────────────── */}
          {evidenceForDisplay.length > 0 && (
            <section aria-labelledby="section-evidence-heading">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
                    4
                  </span>
                  <h2
                    id="section-evidence-heading"
                    className="text-base font-semibold text-[#1B2A4A]"
                  >
                    Evidence
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {evidenceForDisplay.map((record) => (
                    <EvidenceCard key={record.id} record={record} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Section 5: Testing Laboratories ──────────────────────────── */}
          <section aria-labelledby="section-labs-heading">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1B2A4A] text-white text-xs font-bold">
                  5
                </span>
                <h2
                  id="section-labs-heading"
                  className="text-base font-semibold text-[#1B2A4A]"
                >
                  Testing Laboratories
                </h2>
              </div>

              <p className="text-sm text-[#64748B]">
                Laboratories accredited for IS 14543 testing (from public BIS LIMS snapshot)
              </p>

              {/* Snapshot provenance notice */}
              <div className="flex items-start gap-2 text-xs text-[#B45309] bg-[#FEF9C3] border border-[#FDE68A] rounded-md px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  Verify current laboratory status on BIS LIMS before booking/testing.
                  Public BIS LIMS snapshot — retrieved 28 Sep 2026.
                </span>
              </div>

              {/* Lab cards */}
              <div className="flex flex-col gap-3">
                {labs.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </div>
          </section>

          {/* ── Next action CTA ───────────────────────────────────────────── */}
          <section
            className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-3"
            aria-labelledby="section-next-action-heading"
          >
            <h2
              id="section-next-action-heading"
              className="text-sm font-semibold text-[#1B2A4A]"
            >
              Next Action
            </h2>
            <p className="text-sm text-[#64748B]">
              Ready to begin the BIS certification process for your packaged drinking water product?
              Start your CRS application on the official BIS portal.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.bis.gov.in/index.php/about-bis/isi-certification/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open BIS certification information (opens in new tab)"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#FF671F] hover:bg-[#E05A17] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF671F] focus-visible:ring-offset-2"
              >
                Start BIS certification
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <a
                href="https://www.bis.gov.in/index.php/standards/bis-catalogue/?category=WRD&number=14543"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View IS 14543 on BIS website (opens in new tab)"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-[#1B2A4A] border border-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2"
              >
                View IS 14543 on BIS
                <span aria-hidden="true">→</span>
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

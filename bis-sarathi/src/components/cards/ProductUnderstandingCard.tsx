// BIS Sarathi — Product Understanding Card
// Displays extracted product attributes surfaced during the STANDARDS_DISCOVERY
// response flow. Shows the product name, category, use context, and a list of
// match reasons explaining why this product was linked to a candidate standard.
//
// Visual treatment:
//   - Light blue-grey background card with a distinct "Why this product?" section
//   - Match reasons displayed as a bulleted list with checkmark icons (✓)
//   - Purely presentational — no interactivity, no 'use client' directive needed
//
// Requirements: 4.1, 4.2, 5.3, 5.5

import type { ProductUnderstanding } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface ProductUnderstandingCardProps {
  data: ProductUnderstanding
}

/**
 * `ProductUnderstandingCard` renders the extracted product attributes that
 * Sarathi identified from the user's query. It is displayed at the top of a
 * STANDARDS_DISCOVERY response to confirm the system understood the product
 * correctly before surfacing candidate standards.
 *
 * @example
 * <ProductUnderstandingCard data={productUnderstanding} />
 */
export function ProductUnderstandingCard({ data }: ProductUnderstandingCardProps) {
  return (
    <article
      className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-md p-4 flex flex-col gap-4"
      aria-label={`Product understanding: ${data.product}`}
    >
      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Product icon — inline SVG, no external dependency */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1D4ED8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        <h3 className="text-sm font-semibold text-[#1E3A5F] uppercase tracking-wide">
          Product Understanding
        </h3>
      </div>

      {/* ── Product attributes grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Product name */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
            Product
          </span>
          <span className="text-sm font-medium text-[#1A1A2E]">{data.product}</span>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
            Category
          </span>
          <span className="text-sm font-medium text-[#1A1A2E]">{data.category}</span>
        </div>

        {/* Use */}
        <div className="flex flex-col gap-0.5 sm:col-span-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
            Use
          </span>
          <span className="text-sm font-medium text-[#1A1A2E]">{data.use}</span>
        </div>
      </div>

      {/* ── Match reasons ────────────────────────────────────────────────── */}
      {data.matchReasons.length > 0 && (
        <div className="border-t border-[#BFDBFE] pt-3 flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#1D4ED8]">
            Why this product?
          </span>
          <ul
            className="flex flex-col gap-1.5"
            aria-label="Match reasons"
          >
            {data.matchReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 text-sm text-[#1A1A2E]"
              >
                {/* Checkmark — inline SVG, colour keyed to the card's blue theme */}
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
    </article>
  )
}

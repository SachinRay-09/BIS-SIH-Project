// BIS Sarathi — Lab Discovery Component
// Standalone lab browser that renders all LabRecord entries from the
// public BIS LIMS snapshot with an optional text filter (by state or lab name).
//
// Layout:
//   - Snapshot freshness notice at top (amber notice strip)
//   - Text filter input (filters by state or lab name, case-insensitive)
//   - Live result count
//   - Grid of LabCard components for matching records
//   - Empty state when no records match the filter
//
// This is a client component because it owns filter state.
// Requirements: 5.4, 6.2, 6.3, 6.7

'use client'

import { useState, useMemo } from 'react'
import { LabCard } from '@/components/cards/LabCard'
import { labs } from '@/data/labs'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SNAPSHOT_NOTICE =
  'Public BIS LIMS snapshot — retrieved 28 Sep 2026. Verify current lab status before booking.'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `LabDiscovery` renders the full list of BIS-recognised laboratories from the
 * public LIMS snapshot, with a live text filter allowing users to narrow results
 * by lab name or state.
 *
 * The snapshot provenance notice is always visible at the top of the component
 * so judges can immediately see the data source and freshness date.
 *
 * Self-contained — no props required. Reads directly from `@/data/labs`.
 *
 * @example
 * <LabDiscovery />
 */
export function LabDiscovery() {
  const [filterQuery, setFilterQuery] = useState('')

  // Filter by lab name or state (case-insensitive substring match)
  const filteredLabs = useMemo(() => {
    const q = filterQuery.trim().toLowerCase()
    if (!q) return labs
    return labs.filter(
      (lab) =>
        lab.labName.toLowerCase().includes(q) ||
        lab.state.toLowerCase().includes(q) ||
        lab.city.toLowerCase().includes(q),
    )
  }, [filterQuery])

  const hasResults = filteredLabs.length > 0
  const isFiltered = filterQuery.trim().length > 0

  return (
    <div className="flex flex-col gap-6">
      {/* ── Snapshot freshness notice ─────────────────────────────────────── */}
      <div
        role="note"
        className="flex items-start gap-2 text-xs text-[#B45309] bg-[#FEF9C3] border border-[#FDE68A] rounded-md px-4 py-3"
      >
        {/* Warning triangle icon */}
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
          focusable="false"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>{SNAPSHOT_NOTICE}</span>
      </div>

      {/* ── Filter input ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="lab-filter"
          className="text-xs font-semibold uppercase tracking-widest text-[#64748B]"
        >
          Filter by lab name or state
        </label>
        <div className="relative">
          {/* Search icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="lab-filter"
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="e.g. Maharashtra, Chennai, NEERI…"
            className="w-full pl-9 pr-9 py-2 text-sm border border-[#E2E8F0] rounded-md text-[#1A1A2E] bg-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
            aria-label="Filter laboratories by lab name or state"
            aria-controls="lab-list"
            aria-describedby="lab-result-count"
          />
          {/* Clear button — only shown when there is input */}
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
              aria-label="Clear filter"
            >
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
                aria-hidden="true"
                focusable="false"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Live result count */}
        <p
          id="lab-result-count"
          className="text-xs text-[#64748B]"
          aria-live="polite"
          aria-atomic="true"
        >
          {isFiltered
            ? `${filteredLabs.length} of ${labs.length} ${labs.length === 1 ? 'laboratory' : 'laboratories'} match your filter`
            : `Showing all ${labs.length} ${labs.length === 1 ? 'laboratory' : 'laboratories'}`}
        </p>
      </div>

      {/* ── Lab cards ────────────────────────────────────────────────────── */}
      {hasResults ? (
        <ul
          id="lab-list"
          className="flex flex-col gap-3 list-none p-0 m-0"
          aria-label="Laboratory records"
        >
          {filteredLabs.map((lab) => (
            <li key={lab.id}>
              <LabCard lab={lab} />
            </li>
          ))}
        </ul>
      ) : (
        /* Empty state */
        <div
          role="status"
          className="flex flex-col items-center gap-3 py-12 text-center text-[#64748B]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#CBD5E1]"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-[#1A1A2E]">No laboratories match your filter</p>
            <p className="text-xs text-[#64748B]">
              Try a different state name or lab name, or{' '}
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="underline underline-offset-2 hover:text-[#1B2A4A] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
              >
                clear the filter
              </button>{' '}
              to see all records.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

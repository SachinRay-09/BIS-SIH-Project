'use client'

// BIS Sarathi — Evidence Page Component
// Searchable/filterable browser for all seeded EvidenceRecord entries.
//
// Features:
//   - Text filter: matches standardOrRecord or source (case-insensitive)
//   - Source-type filter pills: ALL, OFFICIAL_BIS, PUBLIC_BIS_LIMS, MOCK, SYNTHETIC
//   - Renders EvidenceCard for each matching record
//   - Shows record count
//   - Visual section headings that group official from demo/mock/synthetic
//
// Requirements: 11.1, 11.2, 11.3, 11.4, 11.5

import { useState, useMemo } from 'react'
import { evidenceRecords } from '@/data/evidence'
import { EvidenceCard } from '@/components/cards/EvidenceCard'
import type { SourceType } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Filter pill definitions
// ─────────────────────────────────────────────────────────────────────────────

type FilterValue = 'ALL' | SourceType

interface FilterPill {
  value: FilterValue
  label: string
  /** Tailwind classes for the active state of this pill */
  activeClasses: string
}

const FILTER_PILLS: FilterPill[] = [
  {
    value: 'ALL',
    label: 'All',
    activeClasses: 'bg-[#1B2A4A] text-white border-[#1B2A4A]',
  },
  {
    value: 'OFFICIAL_BIS',
    label: 'Official BIS',
    activeClasses: 'bg-[#15803D] text-white border-[#15803D]',
  },
  {
    value: 'PUBLIC_BIS_LIMS',
    label: 'BIS LIMS',
    activeClasses: 'bg-[#1D4ED8] text-white border-[#1D4ED8]',
  },
  {
    value: 'MOCK',
    label: 'Mock',
    activeClasses: 'bg-[#C2410C] text-white border-[#C2410C]',
  },
  {
    value: 'SYNTHETIC',
    label: 'Synthetic',
    activeClasses: 'bg-[#64748B] text-white border-[#64748B]',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `EvidencePage` renders the full, filterable evidence record browser.
 * It is a client component because it manages local filter/search state.
 *
 * Used inside `src/app/evidence/page.tsx` (server component wrapper that
 * provides the page metadata).
 */
export function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL')

  const filteredRecords = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase().trim()

    return evidenceRecords.filter((record) => {
      // Source-type pill filter
      if (activeFilter !== 'ALL' && record.sourceType !== activeFilter) {
        return false
      }

      // Text filter — matches standardOrRecord or source (case-insensitive)
      if (lowerQuery) {
        const matchesStandard = record.standardOrRecord.toLowerCase().includes(lowerQuery)
        const matchesSource = record.source.toLowerCase().includes(lowerQuery)
        const matchesRecordType = record.recordType.toLowerCase().includes(lowerQuery)
        if (!matchesStandard && !matchesSource && !matchesRecordType) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, activeFilter])

  const totalCount = evidenceRecords.length
  const filteredCount = filteredRecords.length

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">Evidence Records</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          All evidence records used in this BIS Sarathi demonstration. Every record carries its
          source type, retrieval date, and a link to the official source.
        </p>
      </div>

      {/* ── Transparency notice ─────────────────────────────────────────────── */}
      <div className="rounded-md border border-[#B45309] bg-[#FEF3C7] px-4 py-3 text-sm text-[#92400E]">
        <span className="font-semibold">Demo dataset transparency — </span>
        Official BIS and Public BIS LIMS records are public-source snapshots retrieved on 28 Sep
        2026. Mock and synthetic records are created solely to demonstrate interaction flows and
        are clearly labelled. None of these records is connected to BIS production systems.
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Text search input */}
        <div>
          <label htmlFor="evidence-search" className="sr-only">
            Filter evidence records
          </label>
          <input
            id="evidence-search"
            type="text"
            aria-label="Filter evidence records"
            placeholder="Filter by standard, record, or source…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-[#94A3B8] focus:border-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:ring-offset-1 transition-colors duration-150"
          />
        </div>

        {/* Source-type filter pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by source type">
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill.value
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => setActiveFilter(pill.value)}
                aria-pressed={isActive}
                className={[
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1',
                  isActive
                    ? pill.activeClasses
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#1A1A2E]',
                ].join(' ')}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Record count ────────────────────────────────────────────────────── */}
      <p className="text-xs text-[#64748B]" aria-live="polite" aria-atomic="true">
        {filteredCount === totalCount
          ? `Showing all ${totalCount} records`
          : `Showing ${filteredCount} of ${totalCount} records`}
      </p>

      {/* ── Evidence cards grid ─────────────────────────────────────────────── */}
      {filteredCount === 0 ? (
        <div className="rounded-md border border-[#E2E8F0] bg-white px-6 py-10 text-center">
          <p className="text-sm text-[#64748B]">No records match the current filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setActiveFilter('ALL')
            }}
            className="mt-3 text-xs font-medium text-[#1B2A4A] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4" role="list" aria-label="Evidence records">
          {filteredRecords.map((record) => (
            <div key={record.id} role="listitem">
              <EvidenceCard record={record} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

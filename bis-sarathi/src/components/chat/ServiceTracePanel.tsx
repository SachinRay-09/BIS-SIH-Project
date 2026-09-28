'use client'

// BIS Sarathi — ServiceTracePanel
// Collapsible panel that renders all six fields of a ServiceTrace object.
// Shows safe pipeline metadata (intent, query type, route, evidence sources,
// evidence status, next action) — never chain-of-thought.
//
// Behaviour:
//   - Hidden by default (isOpen: false)
//   - Toggle button labelled "Show pipeline trace" / "Hide pipeline trace"
//   - Panel content is conditionally rendered (not just visually hidden)
//   - Toggle button uses aria-expanded for screen-reader accessibility
//
// Requirements: 4.6, 4.7
// Feature: bis-sarathi, Property 7: service trace panel renders all 6 required fields
// Feature: bis-sarathi, Property 8: service trace toggle show/hide round-trip

import { useState } from 'react'
import type { ServiceTrace } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceTracePanelProps {
  trace: ServiceTrace
}

// ─────────────────────────────────────────────────────────────────────────────
// Field row sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string
  value: string | string[]
}

function FieldRow({ label, value }: FieldRowProps) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value

  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
        {label}
      </dt>
      <dd className="text-xs text-[#334155] leading-snug">{displayValue}</dd>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `ServiceTracePanel` renders the pipeline metadata for a query response.
 *
 * It is collapsed by default. The toggle button switches between
 * "Show pipeline trace" and "Hide pipeline trace" and sets `aria-expanded`
 * appropriately. When collapsed, the panel content is removed from the DOM
 * (conditional rendering, not CSS visibility).
 *
 * All six ServiceTrace fields are rendered as labelled rows:
 *   INTENT, QUERY TYPE, ROUTE, EVIDENCE SOURCES, EVIDENCE STATUS, NEXT ACTION
 *
 * @example
 * <ServiceTracePanel trace={promptResponse.serviceTrace} />
 */
export function ServiceTracePanel({ trace }: ServiceTracePanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-2">
      {/* ── Toggle button ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="service-trace-panel-content"
        className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
      >
        {/* Chevron indicator */}
        <span
          aria-hidden="true"
          className={[
            'inline-block transition-transform duration-200',
            isOpen ? 'rotate-90' : 'rotate-0',
          ].join(' ')}
        >
          ›
        </span>
        {isOpen ? 'Hide pipeline trace' : 'Show pipeline trace'}
      </button>

      {/* ── Panel content (conditionally rendered) ─────────────────────────── */}
      {isOpen && (
        <div
          id="service-trace-panel-content"
          role="region"
          aria-label="Pipeline trace"
          className="mt-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
        >
          <dl className="flex flex-col gap-3">
            <FieldRow label="Intent" value={trace.intent} />
            <FieldRow label="Query Type" value={trace.queryType} />
            <FieldRow label="Route" value={trace.route} />
            <FieldRow label="Evidence Sources" value={trace.evidenceSources} />
            <FieldRow label="Evidence Status" value={trace.evidenceStatus} />
            <FieldRow label="Next Action" value={trace.nextAction} />
            {'confidenceScore' in trace && typeof trace.confidenceScore === 'number' && (
              <FieldRow label="Confidence Score" value={`${trace.confidenceScore}/100`} />
            )}
          </dl>

          {/* Supplementary note */}
          <p className="mt-3 text-[10px] text-[#94A3B8] italic">
            Safe system metadata only — no chain-of-thought exposed.
          </p>
        </div>
      )}
    </div>
  )
}

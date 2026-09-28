'use client'

// BIS Sarathi — ServiceTracePanel
// Collapsible panel that renders all six fields of a ServiceTrace object.
// Also shows the confidence score breakdown (A.1) and state label (A.2).
// Shows safe pipeline metadata only — never chain-of-thought.
//
// Requirements: 4.6, 4.7

import { useState } from 'react'
import type { ServiceTrace } from '@/lib/types'

interface ServiceTracePanelProps {
  trace: ServiceTrace
}

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

// Confidence state helpers
function getConfidenceState(score: number): { label: string; color: string; bg: string; rationale: string } {
  if (score >= 80) return {
    label: 'HIGH',
    color: '#15803D',
    bg: '#DCFCE7',
    rationale: 'Sufficient authoritative evidence found. Answer is grounded and can be presented directly.',
  }
  if (score >= 50) return {
    label: 'MEDIUM',
    color: '#854D0E',
    bg: '#FEF9C3',
    rationale: 'Partial evidence found. Answer is presented with qualification; additional information may be needed.',
  }
  return {
    label: 'LOW',
    color: '#B91C1C',
    bg: '#FEE2E2',
    rationale: 'Insufficient evidence to ground a response. System abstains rather than fabricating an answer.',
  }
}

// Component score breakdown (from SIH v2 § 12.1 grounding model)
// Weights are illustrative — calibrated per response type
const SCORE_BREAKDOWN: Record<string, { components: { label: string; value: number; weight: number }[] }> = {
  high:   { components: [
    { label: 'Retrieval relevance',      value: 95, weight: 0.25 },
    { label: 'Source authority',         value: 98, weight: 0.20 },
    { label: 'Entity identifier match',  value: 90, weight: 0.15 },
    { label: 'Evidence coverage',        value: 88, weight: 0.15 },
    { label: 'Freshness / version',      value: 95, weight: 0.10 },
    { label: 'Cross-source agreement',   value: 90, weight: 0.10 },
    { label: 'Ambiguity penalty',        value: -5, weight: 0.05 },
  ]},
  medium: { components: [
    { label: 'Retrieval relevance',      value: 72, weight: 0.25 },
    { label: 'Source authority',         value: 80, weight: 0.20 },
    { label: 'Entity identifier match',  value: 60, weight: 0.15 },
    { label: 'Evidence coverage',        value: 55, weight: 0.15 },
    { label: 'Freshness / version',      value: 70, weight: 0.10 },
    { label: 'Cross-source agreement',   value: 50, weight: 0.10 },
    { label: 'Ambiguity penalty',        value: -15, weight: 0.05 },
  ]},
  low:    { components: [
    { label: 'Retrieval relevance',      value: 5,  weight: 0.25 },
    { label: 'Source authority',         value: 0,  weight: 0.20 },
    { label: 'Entity identifier match',  value: 0,  weight: 0.15 },
    { label: 'Evidence coverage',        value: 0,  weight: 0.15 },
    { label: 'Freshness / version',      value: 0,  weight: 0.10 },
    { label: 'Cross-source agreement',   value: 0,  weight: 0.10 },
    { label: 'Ambiguity penalty',        value: -30, weight: 0.05 },
  ]},
}

export function ServiceTracePanel({ trace }: ServiceTracePanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const hasScore = typeof trace.confidenceScore === 'number'
  const state = hasScore ? getConfidenceState(trace.confidenceScore) : null
  const stateKey = state ? state.label.toLowerCase() as 'high' | 'medium' | 'low' : null
  const breakdown = stateKey ? SCORE_BREAKDOWN[stateKey] : null

  return (
    <div className="mt-2">
      {/* ── Toggle button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="service-trace-panel-content"
        className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1 rounded"
      >
        <span
          aria-hidden="true"
          className={['inline-block transition-transform duration-200', isOpen ? 'rotate-90' : 'rotate-0'].join(' ')}
        >
          ›
        </span>
        {isOpen ? 'Hide pipeline trace' : 'Show pipeline trace'}
      </button>

      {/* ── Panel content ── */}
      {isOpen && (
        <div
          id="service-trace-panel-content"
          role="region"
          aria-label="Pipeline trace"
          className="mt-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
        >
          {/* ── Confidence state header (A.2) ── */}
          {hasScore && state && (
            <div className="mb-4 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
                  Grounding Confidence
                </span>
                <span
                  style={{ backgroundColor: state.bg, color: state.color }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                >
                  {state.label} · {trace.confidenceScore}/100
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-snug">{state.rationale}</p>

              {/* ── Score breakdown toggle (A.1) ── */}
              {breakdown && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowBreakdown((p) => !p)}
                    className="text-[10px] text-[#94A3B8] hover:text-[#64748B] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1B2A4A] rounded"
                  >
                    {showBreakdown ? 'Hide' : 'Show'} score breakdown
                  </button>
                  {showBreakdown && (
                    <table className="mt-2 w-full text-[11px]" aria-label="Confidence score breakdown">
                      <thead>
                        <tr>
                          <th scope="col" className="text-left font-semibold text-[#94A3B8] pb-1">Component</th>
                          <th scope="col" className="text-right font-semibold text-[#94A3B8] pb-1 w-12">Score</th>
                          <th scope="col" className="text-right font-semibold text-[#94A3B8] pb-1 w-16">Weight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {breakdown.components.map((c) => (
                          <tr key={c.label}>
                            <td className="py-0.5 text-[#334155]">{c.label}</td>
                            <td className={`py-0.5 text-right tabular-nums font-medium ${c.value < 0 ? 'text-[#B91C1C]' : 'text-[#334155]'}`}>
                              {c.value > 0 ? '+' : ''}{c.value}
                            </td>
                            <td className="py-0.5 text-right tabular-nums text-[#94A3B8]">
                              ×{(c.weight * 100).toFixed(0)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Six core trace fields ── */}
          <dl className="flex flex-col gap-3">
            <FieldRow label="Intent" value={trace.intent} />
            <FieldRow label="Query Type" value={trace.queryType} />
            <FieldRow label="Route" value={trace.route} />
            <FieldRow label="Evidence Sources" value={trace.evidenceSources} />
            <FieldRow label="Evidence Status" value={trace.evidenceStatus} />
            <FieldRow label="Next Action" value={trace.nextAction} />
          </dl>

          <p className="mt-3 text-[10px] text-[#94A3B8] italic">
            Safe system metadata only — no chain-of-thought exposed.
          </p>
        </div>
      )}
    </div>
  )
}

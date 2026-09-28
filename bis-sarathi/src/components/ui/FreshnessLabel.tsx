// BIS Sarathi — Freshness Label
// Inline label that displays the snapshot retrieval date for any evidence
// record. Uses a small inline SVG clock icon — no icon library import needed.
//
// All seeded records carry retrievedAt: "28 Sep 2026". This component renders
// whatever date string is passed in, so it works correctly even if a future
// seed update changes the date.
//
// Styling: text-xs text-slate-500 (greyed-out, non-distracting).
//
// Requirements: 1.5, 6.3

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface FreshnessLabelProps {
  retrievedAt: string
}

/**
 * `FreshnessLabel` renders a subtle "Retrieved: {date}" label with a clock
 * icon. It is a pure display component — no hooks, no client directive needed.
 *
 * @example
 * <FreshnessLabel retrievedAt="28 Sep 2026" />
 * // → 🕐 Retrieved: 28 Sep 2026  (greyed-out, small text)
 */
export function FreshnessLabel({ retrievedAt }: FreshnessLabelProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-slate-500"
      aria-label={`Retrieved: ${retrievedAt}`}
    >
      {/* Inline SVG clock icon — no external dependency */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        <span className="sr-only">Retrieved: </span>
        {retrievedAt}
      </span>
    </span>
  )
}

// BIS Sarathi — Source Badge
// Colour-coded badge component that surfaces the provenance type of any
// evidence record. Every DEMO / MOCK / SYNTHETIC record must always render
// a visible badge — this is enforced by the exhaustive switch below (no
// fallback that could silently produce an empty element).
//
// Colour mapping (mirrors lib/colours.ts + design doc):
//   OFFICIAL_BIS    → green  #15803D  (bg-[#15803D])
//   PUBLIC_BIS_LIMS → blue   #1D4ED8  (bg-[#1D4ED8])
//   DEMO            → amber  #B45309  (bg-[#B45309])
//   MOCK            → orange #C2410C  (bg-[#C2410C])
//   SYNTHETIC       → grey   #64748B  (bg-[#64748B])
//
// Requirements: 1.4, 11.3

import type { SourceType } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Badge configuration
// ─────────────────────────────────────────────────────────────────────────────

interface BadgeConfig {
  label: string
  /** Tailwind background colour class — full class names so Tailwind includes them in the bundle */
  bgClass: string
}

function getBadgeConfig(sourceType: SourceType): BadgeConfig {
  switch (sourceType) {
    case 'OFFICIAL_BIS':
      return { label: 'OFFICIAL BIS', bgClass: 'bg-[#15803D]' }
    case 'PUBLIC_BIS_LIMS':
      return { label: 'BIS LIMS', bgClass: 'bg-[#1D4ED8]' }
    case 'DEMO':
      return { label: 'DEMO', bgClass: 'bg-[#B45309]' }
    case 'MOCK':
      return { label: 'MOCK', bgClass: 'bg-[#C2410C]' }
    case 'SYNTHETIC':
      return { label: 'SYNTHETIC', bgClass: 'bg-[#64748B]' }
    // TypeScript exhaustiveness guard — SourceType union must be fully covered above.
    // If a new SourceType is added without updating this switch, the compiler will
    // surface this error at build time.
    default: {
      const _exhaustive: never = sourceType
      return { label: String(_exhaustive), bgClass: 'bg-[#64748B]' }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface SourceBadgeProps {
  sourceType: SourceType
}

/**
 * `SourceBadge` renders a small pill badge that communicates the
 * provenance/trust level of an evidence record at a glance.
 *
 * The badge is always visible — it never renders as empty. Screen-reader
 * users hear "Source: {label}" via the visually-hidden prefix.
 *
 * @example
 * <SourceBadge sourceType="OFFICIAL_BIS" />  // green "OFFICIAL BIS" pill
 * <SourceBadge sourceType="MOCK" />           // orange "MOCK" pill
 */
export function SourceBadge({ sourceType }: SourceBadgeProps) {
  const { label, bgClass } = getBadgeConfig(sourceType)

  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase text-white',
        bgClass,
      ].join(' ')}
      aria-label={`Source: ${label}`}
    >
      {/* Visually hidden prefix for extra screen-reader clarity */}
      <span className="sr-only">Source: </span>
      {label}
    </span>
  )
}

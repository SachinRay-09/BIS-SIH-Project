'use client'

// BIS Sarathi — DemoScenarioSwitcher component
// Pill-tab control for the six named demo scenarios.
// Lets judges jump directly to a scenario without typing.
// Maps each ScenarioId to its canonical display label.
// On click: updates the active scenario and fires onScenarioChange.
//
// Requirements: 4.2, 4.3, 4.9 (scenario switching, demo navigation)

import type { ScenarioId } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Scenario label map
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIO_LABELS: { id: ScenarioId; label: string }[] = [
  { id: 'INDUSTRY',     label: 'Industry / MSME' },
  { id: 'LAB',          label: 'Lab Finder'       },
  { id: 'CONSUMER',     label: 'Consumer'          },
  { id: 'VERIFICATION', label: 'Verification'      },
  { id: 'COMPLAINT',    label: 'Complaint'         },
  { id: 'TRUST_TEST',   label: 'Trust Test'        },
]

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface DemoScenarioSwitcherProps {
  /** The currently active scenario. */
  activeScenario: ScenarioId
  /** Called with the new ScenarioId when the user selects a different scenario. */
  onScenarioChange: (id: ScenarioId) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function DemoScenarioSwitcher({
  activeScenario,
  onScenarioChange,
}: DemoScenarioSwitcherProps) {
  return (
    <nav
      aria-label="Demo scenarios"
      className="flex flex-wrap gap-2"
    >
      <span className="sr-only">Select a demo scenario:</span>
      {SCENARIO_LABELS.map(({ id, label }) => {
        const isActive = id === activeScenario
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onScenarioChange(id)}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-medium border',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:ring-offset-1',
              isActive
                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                : 'bg-white text-slate-500 border-slate-300 hover:border-[#1B2A4A] hover:text-[#1B2A4A]',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}

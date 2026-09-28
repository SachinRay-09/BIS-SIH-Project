'use client'

// BIS Sarathi — QuickStartPrompts component
// Renders the six canonical quick-start prompt buttons.
// Each button carries a label (display text) and a full prompt string.
// On click, fires onSelect with the full prompt text so ChatInterface
// can populate the input and auto-submit without additional routing logic.
//
// Requirements: 4.2, 4.3

import { QUICK_PROMPTS } from '@/lib/promptRouter'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface QuickStartPromptsProps {
  /** Called with the full prompt text when a button is activated. */
  onSelect: (promptText: string) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function QuickStartPrompts({ onSelect }: QuickStartPromptsProps) {
  return (
    <div
      className="flex flex-col gap-2 w-full"
      aria-label="Quick-start prompts"
    >
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
        Try a demo scenario
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => onSelect(prompt.prompt)}
            className={[
              'text-left px-4 py-3 rounded-lg border text-sm',
              'bg-white border-slate-200 text-slate-700',
              'hover:bg-navy-50 hover:border-[#1B2A4A] hover:text-[#1B2A4A]',
              'focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:ring-offset-1',
              'transition-colors duration-150 cursor-pointer',
            ].join(' ')}
            aria-label={`Quick-start: ${prompt.label}`}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

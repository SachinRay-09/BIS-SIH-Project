'use client'

// BIS Sarathi — Presentation Mode Toggle
// Button in the NavBar that toggles presentationMode in AppContext.
// - aria-pressed reflects current state for assistive technologies
// - Label switches between "Presentation Mode" and "Exit Presentation"
// - Toggle effect (data-presentation on <html>) is handled inside AppContext
//
// Requirements: 2.4, 2.5, 2.6

import { useAppContext } from '@/context/AppContext'

export function PresentationModeToggle() {
  const { presentationMode, setPresentationMode } = useAppContext()

  return (
    <button
      type="button"
      onClick={() => setPresentationMode(!presentationMode)}
      aria-pressed={presentationMode}
      aria-label={
        presentationMode
          ? 'Exit Presentation Mode'
          : 'Enter Presentation Mode'
      }
      className={[
        'text-xs font-medium px-3 py-1.5 rounded border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-1',
        presentationMode
          ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
          : 'bg-white text-[#1B2A4A] border-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white',
      ].join(' ')}
    >
      {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
    </button>
  )
}

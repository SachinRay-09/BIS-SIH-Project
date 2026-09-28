'use client'

// BIS Sarathi — LoadingSequence component
// Animated five-step pipeline display shown while a query is being processed.
// Steps advance sequentially with a 300ms delay between each.
// Requirements: 6.1, 6.2, 6.3 (task 7.1)

import React, { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Step definitions
// Exported so that property tests can assert the exact labels and order.
// Feature: bis-sarathi, Property 6: loading steps appear in correct order
// ─────────────────────────────────────────────────────────────────────────────

export const LOADING_STEPS = [
  'Query Received',
  'Intent Classification',
  'Evidence Retrieval',
  'Grounding Gate',
  'Response Synthesis',
] as const

export type LoadingStep = (typeof LOADING_STEPS)[number]

const STEP_DELAY_MS = 300

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingSequenceProps {
  /** Called once all five steps have completed. */
  onComplete?: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  )
}

function Checkmark() {
  return (
    <span aria-hidden="true" className="inline-block h-4 w-4 text-green-600 font-bold">
      ✓
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LoadingSequence
 *
 * Displays five pipeline steps one by one, each appearing after a 300ms delay.
 * The active step shows a spinner; completed steps show a green checkmark.
 * When all steps are complete the `onComplete` callback is invoked.
 *
 * Respects `prefers-reduced-motion` — when set, all steps appear instantly
 * without animation, and `onComplete` fires immediately.
 */
export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  // activeIndex: index of the step currently being "processed"
  // -1 = not started yet, LOADING_STEPS.length = all done
  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => {
    // Honour prefers-reduced-motion: skip the animation entirely
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Reveal all steps instantly
      setActiveIndex(LOADING_STEPS.length)
      onComplete?.()
      return
    }

    // Advance one step every STEP_DELAY_MS milliseconds
    let current = 0
    setActiveIndex(0)

    const timers: ReturnType<typeof setTimeout>[] = []

    const advance = () => {
      current += 1
      setActiveIndex(current)
      if (current < LOADING_STEPS.length) {
        timers.push(setTimeout(advance, STEP_DELAY_MS))
      } else {
        // All steps complete
        onComplete?.()
      }
    }

    // Schedule the first advancement after STEP_DELAY_MS
    timers.push(setTimeout(advance, STEP_DELAY_MS))

    return () => {
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label="Processing your query"
      className="flex flex-col gap-2 py-3 px-4 rounded-lg bg-slate-50 border border-slate-200 text-sm w-full max-w-sm"
    >
      {LOADING_STEPS.map((step, index) => {
        const isCompleted = index < activeIndex
        const isActive = index === activeIndex && activeIndex < LOADING_STEPS.length
        const isPending = index > activeIndex

        return (
          <div
            key={step}
            className={[
              'flex items-center gap-3 transition-opacity duration-200',
              isPending ? 'opacity-30' : 'opacity-100',
            ].join(' ')}
          >
            {/* Status indicator */}
            <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              {isCompleted && <Checkmark />}
              {isActive && <Spinner />}
              {isPending && (
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-full border border-slate-300"
                />
              )}
            </span>

            {/* Step number + label */}
            <span
              className={[
                'flex-1',
                isCompleted ? 'text-slate-500 line-through' : '',
                isActive ? 'text-slate-800 font-medium' : '',
                isPending ? 'text-slate-400' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="mr-1 text-xs text-slate-400">{index + 1}.</span>
              {step}
            </span>
          </div>
        )
      })}

      {/* Footer label — always visible */}
      <p className="mt-1 text-xs text-slate-400 italic" aria-hidden="true">
        Simulated demo retrieval
      </p>
    </div>
  )
}

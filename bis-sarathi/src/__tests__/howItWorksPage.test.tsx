/**
 * Task 13.12 — Unit tests for How It Works page
 *
 * Verifies:
 * 1. All five pipeline step labels are rendered.
 * 2. All six outcome labels are rendered.
 * 3. Required quote "I will not guess." is rendered.
 *
 * Requirements: 13.1, 13.3, 13.4
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HowItWorksPage from '@/app/how-it-works/page'

// ─────────────────────────────────────────────────────────────────────────────
// Five pipeline steps (Requirement 13.1, 13.2)
// ─────────────────────────────────────────────────────────────────────────────

describe('HowItWorksPage — pipeline steps', () => {
  const STEPS = [
    'Query Received',
    'Intent Classification',
    'Evidence Retrieval',
    'Grounding Gate',
    'Response Synthesis',
  ]

  STEPS.forEach((step) => {
    it(`renders pipeline step "${step}"`, () => {
      render(<HowItWorksPage />)
      expect(screen.getByText(step)).toBeInTheDocument()
    })
  })

  it('renders an ordered list for the pipeline steps', () => {
    render(<HowItWorksPage />)
    const list = screen.getByRole('list', { name: /Processing pipeline steps/i })
    expect(list).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Six outcome labels (Requirement 13.3)
// ─────────────────────────────────────────────────────────────────────────────

describe('HowItWorksPage — outcome labels', () => {
  const OUTCOMES = [
    'Standards Discovery',
    'Lab Discovery',
    'Consumer Explanation',
    'Complaint Draft',
    'Verification Result',
    'Abstention',
  ]

  OUTCOMES.forEach((label) => {
    it(`renders outcome label "${label}"`, () => {
      render(<HowItWorksPage />)
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Three outcome states summary table (Requirement 13.3)
// ─────────────────────────────────────────────────────────────────────────────

describe('HowItWorksPage — three outcome states', () => {
  it('renders the HIGH / SUPPORTED tier', () => {
    render(<HowItWorksPage />)
    expect(screen.getByText('SUPPORTED')).toBeInTheDocument()
  })

  it('renders the MEDIUM / NEEDS CLARIFICATION tier', () => {
    render(<HowItWorksPage />)
    expect(screen.getByText('NEEDS CLARIFICATION')).toBeInTheDocument()
  })

  it('renders the LOW / UNABLE TO VERIFY tier', () => {
    render(<HowItWorksPage />)
    expect(screen.getByText('UNABLE TO VERIFY')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Required quote (Requirement 13.4 — test 13.12)
// ─────────────────────────────────────────────────────────────────────────────

describe('HowItWorksPage — required quotes', () => {
  it('renders the required quote "I will not guess."', () => {
    render(<HowItWorksPage />)
    expect(screen.getByText(/I will not guess\./i)).toBeInTheDocument()
  })

  it('renders the quote "The model explains the evidence. BIS evidence decides."', () => {
    render(<HowItWorksPage />)
    expect(
      screen.getByText(/The model explains the evidence\. BIS evidence decides\./i)
    ).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Architecture pipeline (Requirement 13.1)
// ─────────────────────────────────────────────────────────────────────────────

describe('HowItWorksPage — architecture pipeline', () => {
  it('renders the architecture overview list', () => {
    render(<HowItWorksPage />)
    const pipeline = screen.getByRole('list', { name: /System architecture pipeline/i })
    expect(pipeline).toBeInTheDocument()
  })

  it('renders the "USER" stage in the pipeline', () => {
    render(<HowItWorksPage />)
    expect(screen.getByText('USER')).toBeInTheDocument()
  })

  it('renders the "GROUNDING GATE" stage in the pipeline', () => {
    render(<HowItWorksPage />)
    expect(screen.getByText('GROUNDING GATE')).toBeInTheDocument()
  })
})

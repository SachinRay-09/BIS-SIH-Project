/**
 * Task 13.8 — Unit tests for ComplaintDraftCard
 *
 * Verifies:
 * 1. "Submit to BIS" text does NOT appear anywhere (Req 8.7, 8.8).
 * 2. Missing fields show "Missing — please provide" indicator.
 * 3. Present fields show their value text.
 *
 * Requirements: 8.7, 8.8
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ComplaintDraftCard } from '@/components/cards/ComplaintDraftCard'
import type { ComplaintField } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Fixture — 4 fields: 2 present, 2 missing
// Mirrors the complaint fields from PROMPT_COMPLAINT in data/responses.ts
// ─────────────────────────────────────────────────────────────────────────────

const FOUR_FIELDS: ComplaintField[] = [
  {
    label: 'Product description',
    value: 'Packaged drinking water (brand/size not yet provided)',
    isMissing: false,
  },
  {
    label: 'Licence / ISI mark number',
    value: undefined,
    isMissing: true,
  },
  {
    label: 'Purchase details (where/when purchased)',
    value: undefined,
    isMissing: true,
  },
  {
    label: 'Issue description',
    value: 'Product carries an ISI mark — specific defect or non-compliance not yet described',
    isMissing: false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function renderCard() {
  return render(<ComplaintDraftCard fields={FOUR_FIELDS} />)
}

// ─────────────────────────────────────────────────────────────────────────────
// "Submit to BIS" MUST NOT appear (Requirement 8.7, 8.8)
// ─────────────────────────────────────────────────────────────────────────────

describe('ComplaintDraftCard — no "Submit to BIS"', () => {
  it('does not contain the text "Submit to BIS" anywhere', () => {
    const { container } = renderCard()
    expect(container.textContent).not.toMatch(/Submit to BIS/i)
  })

  it('queryByText returns null for "Submit to BIS"', () => {
    renderCard()
    expect(screen.queryByText(/Submit to BIS/i)).toBeNull()
  })

  it('no button is labelled "Submit to BIS"', () => {
    renderCard()
    expect(screen.queryByRole('button', { name: /Submit to BIS/i })).toBeNull()
  })

  it('no link is labelled "Submit to BIS"', () => {
    renderCard()
    expect(screen.queryByRole('link', { name: /Submit to BIS/i })).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Missing fields — "Missing — please provide" indicator
// ─────────────────────────────────────────────────────────────────────────────

describe('ComplaintDraftCard — missing fields', () => {
  it('renders a "Missing — please provide" indicator for the licence field', () => {
    renderCard()
    // The component renders the indicator text for each isMissing field
    const indicators = screen.getAllByText(/Missing — please provide/i)
    expect(indicators.length).toBeGreaterThanOrEqual(2)
  })

  it('shows the "Licence / ISI mark number" field label', () => {
    renderCard()
    expect(screen.getByText(/Licence \/ ISI mark number/i)).toBeInTheDocument()
  })

  it('shows the "Purchase details" field label', () => {
    renderCard()
    expect(screen.getByText(/Purchase details/i)).toBeInTheDocument()
  })

  it('renders exactly 2 missing indicators for the 2 missing fields', () => {
    renderCard()
    const indicators = screen.getAllByText(/Missing — please provide/i)
    expect(indicators.length).toBe(2)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Present fields — show their value text
// ─────────────────────────────────────────────────────────────────────────────

describe('ComplaintDraftCard — present fields', () => {
  it('renders the product description value text', () => {
    renderCard()
    expect(
      screen.getByText('Packaged drinking water (brand/size not yet provided)')
    ).toBeInTheDocument()
  })

  it('renders the issue description value text', () => {
    renderCard()
    expect(
      screen.getByText(
        'Product carries an ISI mark — specific defect or non-compliance not yet described'
      )
    ).toBeInTheDocument()
  })

  it('renders the "Product description" field label', () => {
    renderCard()
    expect(screen.getByText(/Product description/i)).toBeInTheDocument()
  })

  it('renders the "Issue description" field label', () => {
    renderCard()
    expect(screen.getByText(/Issue description/i)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Official channel — external link, not a "Submit" button
// ─────────────────────────────────────────────────────────────────────────────

describe('ComplaintDraftCard — official channel link', () => {
  it('renders the BIS Care portal link (not a submit button)', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /Open BIS Care portal/i })
    expect(link).toBeInTheDocument()
  })

  it('BIS Care portal link points to the correct URL', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /Open BIS Care portal/i })
    expect(link).toHaveAttribute('href', 'https://www.bis.gov.in/index.php/bis-care/')
  })

  it('BIS Care portal link opens in a new tab', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /Open BIS Care portal/i })
    expect(link).toHaveAttribute('target', '_blank')
  })
})

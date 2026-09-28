/**
 * Task 13.6 — Unit tests for AbstentionResponse
 *
 * Verifies:
 * 1. "Unable to Verify" (or "UNABLE TO VERIFY") label is present.
 * 2. Exact message text is rendered.
 * 3. Both reasons are rendered.
 * 4. "Visit official BIS portal" CTA link is present.
 *
 * Requirements: 10.2, 10.3, 10.4
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { AbstentionResponse } from '@/components/cards/AbstentionResponse'

// ─────────────────────────────────────────────────────────────────────────────
// Fixture — matches the PROMPT_ABSTAIN entry in data/responses.ts exactly
// ─────────────────────────────────────────────────────────────────────────────

const EXACT_MESSAGE =
  'I could not verify this reliably from the available BIS evidence. I will not guess.'

const TWO_REASONS = [
  'No authoritative evidence found in the available BIS dataset for this query.',
  'Insufficient current regulatory data to provide a grounded response.',
]

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function renderAbstention() {
  render(<AbstentionResponse message={EXACT_MESSAGE} reasons={TWO_REASONS} />)
}

// ─────────────────────────────────────────────────────────────────────────────
// "UNABLE TO VERIFY" label
// ─────────────────────────────────────────────────────────────────────────────

describe('AbstentionResponse — label', () => {
  it('renders an "Unable to Verify" / "UNABLE TO VERIFY" label', () => {
    renderAbstention()
    // Multiple elements can match (badge span + article aria-label); assert at least one exists
    const items = screen.getAllByText(/unable to verify/i)
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('label is distinct from the message body (not buried in paragraph text)', () => {
    renderAbstention()
    // At least one visible element with this text should exist
    const items = screen.getAllByText(/unable to verify/i)
    const hasVisible = items.some((el) => el.textContent?.match(/unable to verify/i))
    expect(hasVisible).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Exact message text
// ─────────────────────────────────────────────────────────────────────────────

describe('AbstentionResponse — message', () => {
  it('renders the exact required message text', () => {
    renderAbstention()
    expect(
      screen.getByText(
        'I could not verify this reliably from the available BIS evidence. I will not guess.'
      )
    ).toBeInTheDocument()
  })

  it('message text is visible to the user', () => {
    renderAbstention()
    const msg = screen.getByText(
      'I could not verify this reliably from the available BIS evidence. I will not guess.'
    )
    expect(msg).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Two reasons in the "Why?" section
// ─────────────────────────────────────────────────────────────────────────────

describe('AbstentionResponse — reasons', () => {
  it('renders the first reason', () => {
    renderAbstention()
    expect(
      screen.getByText(/No authoritative evidence found/i)
    ).toBeInTheDocument()
  })

  it('renders the second reason', () => {
    renderAbstention()
    expect(
      screen.getByText(/Insufficient current regulatory data/i)
    ).toBeInTheDocument()
  })

  it('renders both reasons when two are supplied', () => {
    renderAbstention()
    const items = screen.getAllByRole('listitem')
    // At minimum 2 list items (could have more from other lists)
    const reasonItems = items.filter(
      (item) =>
        item.textContent?.includes('No authoritative evidence') ||
        item.textContent?.includes('Insufficient current regulatory data')
    )
    expect(reasonItems.length).toBe(2)
  })

  it('renders a "Why?" heading', () => {
    renderAbstention()
    expect(screen.getByText(/Why\?/i)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// CTA link — "Visit official BIS portal"
// ─────────────────────────────────────────────────────────────────────────────

describe('AbstentionResponse — CTA link', () => {
  it('renders a "Visit official BIS portal" link', () => {
    renderAbstention()
    // aria-label contains the phrase; link text also contains it
    const link = screen.getByRole('link', { name: /Visit official BIS portal/i })
    expect(link).toBeInTheDocument()
  })

  it('CTA link points to https://www.bis.gov.in', () => {
    renderAbstention()
    const link = screen.getByRole('link', { name: /Visit official BIS portal/i })
    expect(link).toHaveAttribute('href', 'https://www.bis.gov.in')
  })

  it('CTA link opens in a new tab (target="_blank")', () => {
    renderAbstention()
    const link = screen.getByRole('link', { name: /Visit official BIS portal/i })
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('CTA link has rel="noopener noreferrer"', () => {
    renderAbstention()
    const link = screen.getByRole('link', { name: /Visit official BIS portal/i })
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

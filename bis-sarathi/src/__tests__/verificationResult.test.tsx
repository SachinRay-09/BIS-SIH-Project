/**
 * Task 13.7 — Unit tests for VerificationResult
 *
 * Verifies:
 * 1. The amber warning banner is rendered (contains the warning text).
 * 2. "Demo Record" label is present.
 * 3. The text "Verified by BIS" does NOT appear anywhere.
 * 4. No element with green background or green color classes is present.
 *
 * Fixture is constructed from the PROMPT_VERIFY entry in data/responses.ts.
 *
 * Requirements: 9.2, 9.3, 9.5
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { VerificationResult } from '@/components/cards/VerificationResult'
import type { VerificationSummary } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Fixture — taken from PROMPT_VERIFY in data/responses.ts
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_LIC_001_SUMMARY: VerificationSummary = {
  licenceId: 'DEMO-LIC-001',
  status: 'Sample/Mock',
  warningText:
    'THIS IS A MOCK DEMONSTRATION RECORD ONLY. ' +
    'It does not represent a real BIS licence, a real manufacturer, or a real product. ' +
    'This record is not sourced from, and is not connected to, the BIS production licence registry or any official BIS system. ' +
    'Do not use this information for any compliance, legal, or purchasing decision. ' +
    'To verify a real ISI licence, visit the official BIS portal at https://www.bis.gov.in.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function renderResult() {
  return render(<VerificationResult result={DEMO_LIC_001_SUMMARY} />)
}

// ─────────────────────────────────────────────────────────────────────────────
// Amber warning banner
// ─────────────────────────────────────────────────────────────────────────────

describe('VerificationResult — amber warning banner', () => {
  it('renders the warning banner (role="alert")', () => {
    renderResult()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('banner contains the warning text about mock record', () => {
    renderResult()
    expect(
      screen.getByText(/THIS IS A MOCK DEMONSTRATION RECORD ONLY/i)
    ).toBeInTheDocument()
  })

  it('banner contains the "not connected to BIS production" notice', () => {
    renderResult()
    expect(
      screen.getByText(/not connected to, the BIS production licence registry/i)
    ).toBeInTheDocument()
  })

  it('warning banner is visible', () => {
    renderResult()
    const alert = screen.getByRole('alert')
    expect(alert).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// "Demo Record" label
// ─────────────────────────────────────────────────────────────────────────────

describe('VerificationResult — Demo Record label', () => {
  it('renders a "Demo Record" label', () => {
    renderResult()
    expect(screen.getByText(/Demo Record/i)).toBeInTheDocument()
  })

  it('"Demo Record" label is visible', () => {
    renderResult()
    const label = screen.getByText(/Demo Record/i)
    expect(label).toBeVisible()
  })

  it('renders the licence ID DEMO-LIC-001', () => {
    renderResult()
    expect(screen.getByText('DEMO-LIC-001')).toBeInTheDocument()
  })

  it('renders the status "Sample/Mock"', () => {
    renderResult()
    expect(screen.getByText('Sample/Mock')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// "Verified by BIS" MUST NOT appear (Requirement 9.4, 1.2)
// ─────────────────────────────────────────────────────────────────────────────

describe('VerificationResult — no "Verified by BIS" text', () => {
  it('does not contain the text "Verified by BIS"', () => {
    const { container } = renderResult()
    expect(container.textContent).not.toMatch(/Verified by BIS/i)
  })

  it('queryByText returns null for "Verified by BIS"', () => {
    renderResult()
    expect(screen.queryByText(/Verified by BIS/i)).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// No green visual treatment (Requirement 9.5)
// ─────────────────────────────────────────────────────────────────────────────

describe('VerificationResult — no green visual treatment', () => {
  it('no element has a Tailwind green background class (bg-green-*)', () => {
    const { container } = renderResult()
    // Search for any class containing "bg-green"
    const elements = container.querySelectorAll('[class*="bg-green"]')
    expect(elements.length).toBe(0)
  })

  it('no element has a Tailwind green text class (text-green-*)', () => {
    const { container } = renderResult()
    const elements = container.querySelectorAll('[class*="text-green"]')
    expect(elements.length).toBe(0)
  })

  it('no element has inline style with the BIS green color (#15803D)', () => {
    const { container } = renderResult()
    const html = container.innerHTML
    expect(html).not.toMatch(/#15803D/i)
    expect(html).not.toMatch(/15803d/i)
  })
})

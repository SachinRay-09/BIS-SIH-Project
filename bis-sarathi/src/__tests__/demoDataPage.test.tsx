/**
 * Task 13.11 — Unit tests for Demo Data page
 *
 * Verifies:
 * 1. "Standards" section heading is present.
 * 2. "Laboratories" section heading is present.
 * 3. "Verification Record" section heading is present.
 *
 * Requirements: 12.1
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// next/link is used in the page's transparency notice
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import DemoDataPage from '@/app/demo-data/page'

// ─────────────────────────────────────────────────────────────────────────────
// Three required sections (Requirement 12.1)
// ─────────────────────────────────────────────────────────────────────────────

describe('DemoDataPage — three required sections', () => {
  it('renders "Standards" section heading', () => {
    render(<DemoDataPage />)
    expect(
      screen.getByRole('heading', { name: /^Standards$/i })
    ).toBeInTheDocument()
  })

  it('renders "Laboratories" section heading', () => {
    render(<DemoDataPage />)
    expect(
      screen.getByRole('heading', { name: /^Laboratories$/i })
    ).toBeInTheDocument()
  })

  it('renders "Verification Record" section heading', () => {
    render(<DemoDataPage />)
    expect(
      screen.getByRole('heading', { name: /^Verification Record$/i })
    ).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Page header
// ─────────────────────────────────────────────────────────────────────────────

describe('DemoDataPage — page header', () => {
  it('renders the main h1 heading', () => {
    render(<DemoDataPage />)
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toBeInTheDocument()
  })

  it('renders the transparency notice', () => {
    render(<DemoDataPage />)
    expect(screen.getByRole('note')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Required statement about mock records (Requirement 12.4)
// ─────────────────────────────────────────────────────────────────────────────

describe('DemoDataPage — mock record statement', () => {
  it('renders statement about mock records and interaction flows', () => {
    render(<DemoDataPage />)
    expect(
      screen.getByText(/Mock records are used only to demonstrate interaction flows/i)
    ).toBeInTheDocument()
  })

  it('renders the DEMO-LIC-001 licence ID', () => {
    render(<DemoDataPage />)
    // DEMO-LIC-001 appears multiple times (as RecordCard id and as a field value)
    const items = screen.getAllByText('DEMO-LIC-001')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Retrieval dates (Requirement 12.3)
// ─────────────────────────────────────────────────────────────────────────────

describe('DemoDataPage — retrieval dates', () => {
  it('renders "28 Sep 2026" as a retrieval date', () => {
    render(<DemoDataPage />)
    const dateElements = screen.getAllByText(/28 Sep 2026/i)
    expect(dateElements.length).toBeGreaterThanOrEqual(1)
  })
})

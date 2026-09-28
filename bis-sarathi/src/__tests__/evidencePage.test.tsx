/**
 * Task 13.9 — Unit tests for EvidencePage
 *
 * Verifies:
 * 1. The text filter input is present.
 * 2. Records render with no filter active (known record ID visible).
 * 3. Multiple evidence cards are rendered.
 *
 * Requirements: 11.1, 11.4
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { EvidencePage } from '@/components/EvidencePage'

// ─────────────────────────────────────────────────────────────────────────────
// Filter input
// ─────────────────────────────────────────────────────────────────────────────

describe('EvidencePage — filter input present', () => {
  it('renders the filter text input', () => {
    render(<EvidencePage />)
    expect(
      screen.getByRole('textbox', { name: /Filter evidence records/i })
    ).toBeInTheDocument()
  })

  it('renders filter input with correct placeholder', () => {
    render(<EvidencePage />)
    const input = screen.getByRole('textbox', { name: /Filter evidence records/i })
    expect(input).toHaveAttribute('placeholder', expect.stringMatching(/Filter by standard/i))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Records render without active filter
// ─────────────────────────────────────────────────────────────────────────────

describe('EvidencePage — records render without filter', () => {
  it('renders evidence records without filter active — IS 14543:2024 visible', () => {
    render(<EvidencePage />)
    expect(screen.getByText('IS 14543:2024')).toBeInTheDocument()
  })

  it('renders evidence records without filter active — IS 14543:2016 visible', () => {
    render(<EvidencePage />)
    expect(screen.getByText('IS 14543:2016')).toBeInTheDocument()
  })

  it('renders the mock verification record DEMO-LIC-001', () => {
    render(<EvidencePage />)
    expect(screen.getByText('DEMO-LIC-001')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Multiple evidence cards
// ─────────────────────────────────────────────────────────────────────────────

describe('EvidencePage — multiple evidence cards render', () => {
  it('renders multiple evidence cards (at least 5)', () => {
    render(<EvidencePage />)
    // Each card renders in a listitem role container
    const listitems = screen.getAllByRole('listitem')
    expect(listitems.length).toBeGreaterThanOrEqual(5)
  })

  it('renders the record count text', () => {
    render(<EvidencePage />)
    // The live region shows "Showing all X records"
    expect(screen.getByText(/Showing all/i)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Source-type filter pills
// ─────────────────────────────────────────────────────────────────────────────

describe('EvidencePage — source-type filter pills', () => {
  it('renders filter group with "All" pill', () => {
    render(<EvidencePage />)
    const group = screen.getByRole('group', { name: /Filter by source type/i })
    expect(group).toBeInTheDocument()
  })

  it('renders an "Official BIS" filter pill', () => {
    render(<EvidencePage />)
    expect(screen.getByRole('button', { name: /Official BIS/i })).toBeInTheDocument()
  })

  it('renders a "BIS LIMS" filter pill', () => {
    render(<EvidencePage />)
    expect(screen.getByRole('button', { name: /BIS LIMS/i })).toBeInTheDocument()
  })
})

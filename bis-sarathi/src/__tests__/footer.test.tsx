/**
 * Task 13.10 — Unit tests for Footer
 *
 * Verifies:
 * 1. Link to bis.gov.in is present.
 * 2. BIS Standards link has correct href.
 * 3. BIS LIMS link has correct href.
 * 4. BIS Care link has correct href.
 * 5. "Not connected to BIS production systems" disclaimer is present.
 *
 * Requirements: 1.6, 15.8
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Footer } from '@/components/layout/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// External links
// ─────────────────────────────────────────────────────────────────────────────

describe('Footer — links', () => {
  it('renders a link to bis.gov.in', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    const bisLink = links.find((l) => l.getAttribute('href') === 'https://www.bis.gov.in')
    expect(bisLink).toBeTruthy()
  })

  it('renders the "Official BIS" link pointing to https://www.bis.gov.in', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /Official BIS/i })
    expect(link).toHaveAttribute('href', 'https://www.bis.gov.in')
  })

  it('renders the "BIS Standards" link with correct href', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /BIS Standards/i })
    expect(link).toHaveAttribute('href', 'https://www.bis.gov.in/index.php/standards/')
  })

  it('renders the "BIS LIMS" link with correct href', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /BIS LIMS/i })
    expect(link).toHaveAttribute('href', 'https://www.bis.gov.in/index.php/labs/')
  })

  it('renders the "BIS Care" link with correct href', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /BIS Care/i })
    expect(link).toHaveAttribute('href', 'https://www.bis.gov.in/index.php/bis-care/')
  })

  it('all four external links open in a new tab', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Disclaimer text (Requirement 1.6, 15.8)
// ─────────────────────────────────────────────────────────────────────────────

describe('Footer — disclaimer text', () => {
  it('renders "Not connected to BIS production systems" disclaimer', () => {
    render(<Footer />)
    expect(
      screen.getByText(/Not connected to BIS production systems/i)
    ).toBeInTheDocument()
  })

  it('renders "Interactive concept demonstrator" text', () => {
    render(<Footer />)
    expect(
      screen.getByText(/Interactive concept demonstrator/i)
    ).toBeInTheDocument()
  })

  it('renders "BIS Sarathi" application name', () => {
    render(<Footer />)
    expect(screen.getByText(/BIS Sarathi/i)).toBeInTheDocument()
  })

  it('renders SIH 2026 attribution', () => {
    render(<Footer />)
    expect(screen.getByText(/SIH 2026/i)).toBeInTheDocument()
  })
})

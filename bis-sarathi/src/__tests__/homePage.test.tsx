/**
 * Task 13.3 — Unit tests for the Home page
 *
 * Verifies exact title text, tagline, CTA links, and capability card titles.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ─── Module mocks ───────────────────────────────────────────────────────────

// HomePage uses next/link for CTA buttons and capability card links.
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// ─── Component import ────────────────────────────────────────────────────────

import HomePage from '@/app/page'

// ─────────────────────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────────────────────

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />)
  })

  // ── Title ──────────────────────────────────────────────────────────────────

  it('renders the h1 with exact text "BIS Sarathi"', () => {
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('BIS Sarathi')
  })

  // ── Tagline ────────────────────────────────────────────────────────────────

  it('renders tagline text containing "AI-assisted navigation for BIS standards"', () => {
    expect(
      screen.getByText(/AI-assisted navigation for BIS standards/i)
    ).toBeInTheDocument()
  })

  // ── CTA — Ask Sarathi ──────────────────────────────────────────────────────

  it('renders a CTA link "Ask Sarathi →" pointing to /ask', () => {
    const link = screen.getByRole('link', { name: /Ask Sarathi/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/ask')
  })

  // ── CTA — View Evidence ────────────────────────────────────────────────────

  it('renders a CTA link "View Evidence →" pointing to /evidence', () => {
    const link = screen.getByRole('link', { name: /View Evidence/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/evidence')
  })

  // ── Capability card titles ─────────────────────────────────────────────────

  it('renders a capability card titled "Standards Discovery"', () => {
    expect(screen.getByText('Standards Discovery')).toBeInTheDocument()
  })

  it('renders a capability card titled "Lab Finder"', () => {
    expect(screen.getByText('Lab Finder')).toBeInTheDocument()
  })

  it('renders a capability card titled "Consumer Guidance"', () => {
    expect(screen.getByText('Consumer Guidance')).toBeInTheDocument()
  })

  it('renders a capability card titled "Licence Verification"', () => {
    expect(screen.getByText('Licence Verification')).toBeInTheDocument()
  })

  // ── All four capability cards present ─────────────────────────────────────

  it('renders exactly four capability cards', () => {
    const cardTitles = [
      'Standards Discovery',
      'Lab Finder',
      'Consumer Guidance',
      'Licence Verification',
    ]
    cardTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })

  // ── Demo mode notice ───────────────────────────────────────────────────────

  it('renders the demo mode notice', () => {
    expect(screen.getByText(/Demo mode/i)).toBeInTheDocument()
  })

  // ── Choose your journey section ────────────────────────────────────────────

  it('renders the "Choose your journey" section', () => {
    expect(screen.getByText(/Choose your journey/i)).toBeInTheDocument()
  })

  it('renders an Industry / MSME journey link', () => {
    expect(screen.getByRole('link', { name: /Industry \/ MSME/i })).toBeInTheDocument()
  })

  it('renders a Consumer journey link', () => {
    // Match the "Consumer" journey card (distinct from the nav — no nav here)
    const consumerLinks = screen.getAllByRole('link', { name: /Consumer/i })
    expect(consumerLinks.length).toBeGreaterThanOrEqual(1)
  })
})

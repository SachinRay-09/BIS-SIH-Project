/**
 * Task 13.2 — Unit tests for layout components
 *
 * Tests each layout component in isolation (DemoBanner, NavBar, Footer).
 * The root layout.tsx is a Next.js Server Component and cannot be rendered
 * directly in Vitest; we test each child component individually instead.
 *
 * Requirements: 1.1, 2.1, 15.8
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ─── Module mocks ───────────────────────────────────────────────────────────

// next/navigation — NavBar calls usePathname()
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// next/link — renders as a plain <a> in the test environment
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// AppContext — PresentationModeToggle (inside NavBar) calls useAppContext()
vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    presentationMode: false,
    setPresentationMode: vi.fn(),
  }),
}))

// ─── Component imports (after mocks) ────────────────────────────────────────

import { DemoBanner } from '@/components/layout/DemoBanner'
import { NavBar } from '@/components/layout/NavBar'
import { Footer } from '@/components/layout/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// DemoBanner
// ─────────────────────────────────────────────────────────────────────────────

describe('DemoBanner', () => {
  it('renders text containing "INTERACTIVE DEMO"', () => {
    render(<DemoBanner />)
    // The banner uses &mdash; which renders as "—" in the DOM
    expect(screen.getByText(/INTERACTIVE DEMO/i)).toBeInTheDocument()
  })

  it('renders as a banner landmark', () => {
    render(<DemoBanner />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('contains the demo disclaimer text about BIS production systems', () => {
    render(<DemoBanner />)
    expect(screen.getByText(/Not connected to BIS production systems/i)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// NavBar
// ─────────────────────────────────────────────────────────────────────────────

describe('NavBar', () => {
  beforeEach(() => {
    render(<NavBar />)
  })

  it('renders a navigation element', () => {
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })

  it('renders the BIS Sarathi brand link', () => {
    expect(screen.getByRole('link', { name: /BIS Sarathi/i })).toBeInTheDocument()
  })

  it('renders nav items for all primary links', () => {
    expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ask Sarathi/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Industry/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Consumer/i })).toBeInTheDocument()
  })

  it('renders nav items for secondary links', () => {
    expect(screen.getByRole('link', { name: /Evidence/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /How It Works/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Demo Data/i })).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  it('renders the application name and SIH attribution', () => {
    // The footer uses &bull; which renders as "•" in the DOM
    expect(screen.getByText(/BIS Sarathi \| SIH 2026/i)).toBeInTheDocument()
  })

  it('renders the demo disclaimer text', () => {
    expect(
      screen.getByText(/Interactive concept demonstrator using seeded\/public-source demo records/i)
    ).toBeInTheDocument()
  })

  it('renders an "Official BIS" external link', () => {
    expect(screen.getByRole('link', { name: /Official BIS/i })).toBeInTheDocument()
  })

  it('renders a "BIS Standards" external link', () => {
    expect(screen.getByRole('link', { name: /BIS Standards/i })).toBeInTheDocument()
  })

  it('renders a "BIS LIMS" external link', () => {
    expect(screen.getByRole('link', { name: /BIS LIMS/i })).toBeInTheDocument()
  })

  it('renders a "BIS Care" external link', () => {
    expect(screen.getByRole('link', { name: /BIS Care/i })).toBeInTheDocument()
  })

  it('renders footer as a contentinfo landmark', () => {
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

/**
 * Task 13.4 — Unit tests for NavBar — all 7 link destinations
 *
 * Mocks usePathname to "/" and verifies all seven required nav link hrefs
 * are present in the rendered output.
 *
 * Requirements: 2.1
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ─── Module mocks ───────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  // Forward all props (including aria-current) so active-link detection is testable
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    presentationMode: false,
    setPresentationMode: vi.fn(),
  }),
}))

// ─── Component import ────────────────────────────────────────────────────────

import { NavBar } from '@/components/layout/NavBar'

// ─────────────────────────────────────────────────────────────────────────────
// NavBar link href assertions
// ─────────────────────────────────────────────────────────────────────────────

describe('NavBar — link hrefs', () => {
  beforeEach(() => {
    render(<NavBar />)
  })

  const EXPECTED_HREFS = [
    { name: '/', label: 'Home' },
    { name: '/ask', label: 'Ask Sarathi' },
    { name: '/industry', label: 'Industry' },
    { name: '/consumer', label: 'Consumer' },
    { name: '/evidence', label: 'Evidence' },
    { name: '/how-it-works', label: 'How It Works' },
    { name: '/demo-data', label: 'Demo Data' },
  ]

  EXPECTED_HREFS.forEach(({ name: href, label }) => {
    it(`renders a link with href="${href}" (${label})`, () => {
      // Query all <a> elements and find the one with this exact href
      const links = screen.getAllByRole('link')
      const match = links.find((el) => el.getAttribute('href') === href)
      expect(match, `Expected a link with href="${href}" to be present`).toBeTruthy()
    })
  })

  it('renders all 7 nav item hrefs', () => {
    const allLinks = screen.getAllByRole('link')
    const hrefs = allLinks.map((el) => el.getAttribute('href'))

    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/ask')
    expect(hrefs).toContain('/industry')
    expect(hrefs).toContain('/consumer')
    expect(hrefs).toContain('/evidence')
    expect(hrefs).toContain('/how-it-works')
    expect(hrefs).toContain('/demo-data')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Active link detection
// ─────────────────────────────────────────────────────────────────────────────

describe('NavBar — active link (usePathname = "/")', () => {
  beforeEach(() => {
    render(<NavBar />)
  })

  it('marks the Home link as current page', () => {
    // NavBar sets aria-current="page" on the active link
    const homeLink = screen.getByRole('link', { name: /^Home$/i })
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })
})

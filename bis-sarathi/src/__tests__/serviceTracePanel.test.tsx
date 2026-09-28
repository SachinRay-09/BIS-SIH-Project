/**
 * Task 13.5 — Unit tests for ServiceTracePanel
 *
 * Verifies that:
 * 1. The panel is collapsed by default (content not in DOM).
 * 2. Clicking "Show pipeline trace" reveals the panel.
 * 3. All 6 ServiceTrace fields are rendered with their values.
 * 4. Clicking the toggle again hides the panel.
 *
 * Requirements: 4.6, 4.7
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import type { ServiceTrace } from '@/lib/types'

// ─── Component import ────────────────────────────────────────────────────────

import { ServiceTracePanel } from '@/components/chat/ServiceTracePanel'

// ─────────────────────────────────────────────────────────────────────────────
// Fixture trace object
// ─────────────────────────────────────────────────────────────────────────────

const FIXTURE_TRACE: ServiceTrace = {
  intent: 'Standards recommendation for packaged drinking water',
  queryType: 'Product → Standard',
  route: 'BIS Standards catalogue + version/revision rules',
  evidenceSources: ['BIS Standards Catalogue (bis.gov.in)', 'BIS LIMS snapshot'],
  evidenceStatus: 'Supported by available evidence',
  nextAction: 'View official BIS record for IS 14543',
  confidenceScore: 92,
}

// ─────────────────────────────────────────────────────────────────────────────
// Default (collapsed) state
// ─────────────────────────────────────────────────────────────────────────────

describe('ServiceTracePanel — collapsed state', () => {
  it('renders the toggle button "Show pipeline trace"', () => {
    render(<ServiceTracePanel trace={FIXTURE_TRACE} />)
    expect(screen.getByRole('button', { name: /Show pipeline trace/i })).toBeInTheDocument()
  })

  it('does not render the panel content when collapsed', () => {
    render(<ServiceTracePanel trace={FIXTURE_TRACE} />)
    expect(screen.queryByRole('region', { name: /Pipeline trace/i })).not.toBeInTheDocument()
  })

  it('toggle button has aria-expanded="false" when collapsed', () => {
    render(<ServiceTracePanel trace={FIXTURE_TRACE} />)
    const btn = screen.getByRole('button', { name: /Show pipeline trace/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Expanded state — clicking "Show pipeline trace"
// ─────────────────────────────────────────────────────────────────────────────

describe('ServiceTracePanel — expanded state', () => {
  async function renderAndExpand() {
    const user = userEvent.setup()
    render(<ServiceTracePanel trace={FIXTURE_TRACE} />)
    await user.click(screen.getByRole('button', { name: /Show pipeline trace/i }))
    return user
  }

  it('clicking the toggle reveals the panel region', async () => {
    await renderAndExpand()
    expect(screen.getByRole('region', { name: /Pipeline trace/i })).toBeInTheDocument()
  })

  it('toggle button label changes to "Hide pipeline trace"', async () => {
    await renderAndExpand()
    expect(screen.getByRole('button', { name: /Hide pipeline trace/i })).toBeInTheDocument()
  })

  it('toggle button has aria-expanded="true" when open', async () => {
    await renderAndExpand()
    const btn = screen.getByRole('button', { name: /Hide pipeline trace/i })
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  // ── All 6 fields present ────────────────────────────────────────────────

  it('renders the INTENT field value', async () => {
    await renderAndExpand()
    expect(screen.getByText(FIXTURE_TRACE.intent)).toBeInTheDocument()
  })

  it('renders the QUERY TYPE field value', async () => {
    await renderAndExpand()
    expect(screen.getByText(FIXTURE_TRACE.queryType)).toBeInTheDocument()
  })

  it('renders the ROUTE field value', async () => {
    await renderAndExpand()
    expect(screen.getByText(FIXTURE_TRACE.route)).toBeInTheDocument()
  })

  it('renders the EVIDENCE SOURCES field value (comma-joined)', async () => {
    await renderAndExpand()
    // The component joins the array with ", "
    const expected = FIXTURE_TRACE.evidenceSources.join(', ')
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('renders the EVIDENCE STATUS field value', async () => {
    await renderAndExpand()
    expect(screen.getByText(FIXTURE_TRACE.evidenceStatus)).toBeInTheDocument()
  })

  it('renders the NEXT ACTION field value', async () => {
    await renderAndExpand()
    expect(screen.getByText(FIXTURE_TRACE.nextAction)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Toggle round-trip: show → hide
// ─────────────────────────────────────────────────────────────────────────────

describe('ServiceTracePanel — toggle round-trip', () => {
  it('hiding after showing removes the panel content from the DOM', async () => {
    const user = userEvent.setup()
    render(<ServiceTracePanel trace={FIXTURE_TRACE} />)

    // Open
    await user.click(screen.getByRole('button', { name: /Show pipeline trace/i }))
    expect(screen.getByRole('region', { name: /Pipeline trace/i })).toBeInTheDocument()

    // Close
    await user.click(screen.getByRole('button', { name: /Hide pipeline trace/i }))
    expect(screen.queryByRole('region', { name: /Pipeline trace/i })).not.toBeInTheDocument()
  })

  it('toggle button returns to aria-expanded="false" after closing', async () => {
    const user = userEvent.setup()
    render(<ServiceTracePanel trace={FIXTURE_TRACE} />)

    await user.click(screen.getByRole('button', { name: /Show pipeline trace/i }))
    await user.click(screen.getByRole('button', { name: /Hide pipeline trace/i }))

    const btn = screen.getByRole('button', { name: /Show pipeline trace/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })
})

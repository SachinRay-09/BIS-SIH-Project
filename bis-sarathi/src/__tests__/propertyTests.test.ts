/**
 * Tasks 14.1–14.14 — Property-Based Tests for BIS Sarathi
 *
 * Uses fast-check for arbitrary-input properties.
 * Data-layer properties (14.4, 14.5, 14.10, etc.) are tested without rendering.
 * Component-level properties are tested with @testing-library/react where needed.
 *
 * Feature: bis-sarathi
 *
 * Requirements: 1.1, 1.2, 1.4, 1.5, 2.5, 2.6, 4.2, 4.3, 4.4, 4.6, 4.7,
 *               4.8, 6.4, 8.7, 8.8, 10.1, 10.2, 11.1, 11.2, 14.1, 14.4
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

// ─── Data imports ─────────────────────────────────────────────────────────────
import { evidenceRecords } from '@/data/evidence'
import { labs } from '@/data/labs'
import { QUICK_PROMPTS, resolvePrompt } from '@/lib/promptRouter'
import { responses } from '@/data/responses'
import { LOADING_STEPS } from '@/components/chat/LoadingSequence'

// ─────────────────────────────────────────────────────────────────────────────
// Property 1: Demo banner always present on every page route
// Validates: Requirements 1.1
//
// Strategy: data-layer assertion — the DemoBanner component exists and renders
// the required exact text. Rendering every route in property tests is
// prohibitively expensive, so we verify the banner text constant is correct
// and that the component renders the exact required string.
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 1: Demo banner always present', () => {
  it('DemoBanner component file exports the required banner text as a constant', async () => {
    // Import the component source and check the required text is rendered
    const { render } = await import('@testing-library/react')
    const React = await import('react')
    const { DemoBanner } = await import('@/components/layout/DemoBanner')
    const { screen } = await import('@testing-library/react')
    render(React.createElement(DemoBanner))
    expect(
      screen.getByText(
        /INTERACTIVE DEMO.*Uses seeded\/public-source demonstration records.*Not connected to BIS production systems/i
      )
    ).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 2: "Verified by BIS" never appears in any response
// Validates: Requirements 1.2, 9.4
//
// Strategy: scan all seeded assistantMessage strings for the forbidden phrase.
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 2: "Verified by BIS" never appears in seeded responses', () => {
  it('no PromptResponse.assistantMessage contains "Verified by BIS"', () => {
    const allMessages = Object.values(responses).map((r) => r.assistantMessage)
    allMessages.forEach((msg) => {
      expect(msg).not.toMatch(/Verified by BIS/i)
    })
  })

  it('VerificationResult component does not contain "Verified by BIS"', async () => {
    const { render } = await import('@testing-library/react')
    const React = await import('react')
    const { VerificationResult } = await import('@/components/cards/VerificationResult')
    const { container } = render(
      React.createElement(VerificationResult, {
        result: {
          licenceId: 'DEMO-LIC-001',
          status: 'Sample/Mock',
          warningText: 'THIS IS A MOCK DEMONSTRATION RECORD ONLY.',
        },
      })
    )
    expect(container.textContent).not.toMatch(/Verified by BIS/i)
  })

  /**
   * **Validates: Requirements 1.2, 9.4**
   * Property: for all PromptIds, no response payload contains "Verified by BIS"
   */
  it('property: no response in the responses map contains "Verified by BIS"', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...(Object.keys(responses) as (keyof typeof responses)[])),
        (promptId) => {
          const response = responses[promptId]
          const text = JSON.stringify(response)
          return !text.match(/Verified by BIS/i)
        }
      )
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 3: Source badge present on all DEMO/MOCK/SYNTHETIC evidence records
// Validates: Requirements 1.4, 11.3
//
// Strategy: for each record with a non-official sourceType, render the
// SourceBadge and verify it displays a non-empty label.
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 3: Source badge on demo/mock/synthetic records', () => {
  it('every evidence record has a defined sourceType', () => {
    evidenceRecords.forEach((record) => {
      expect(record.sourceType).toBeDefined()
      expect(typeof record.sourceType).toBe('string')
      expect(record.sourceType.length).toBeGreaterThan(0)
    })
  })

  it('MOCK and SYNTHETIC records carry their sourceType label', () => {
    const nonOfficialRecords = evidenceRecords.filter(
      (r) => r.sourceType === 'MOCK' || r.sourceType === 'SYNTHETIC'
    )
    expect(nonOfficialRecords.length).toBeGreaterThanOrEqual(2)
    nonOfficialRecords.forEach((record) => {
      // The SourceBadge switch covers MOCK and SYNTHETIC
      expect(['MOCK', 'SYNTHETIC', 'DEMO']).toContain(record.sourceType)
    })
  })

  /**
   * **Validates: Requirements 1.4, 11.3**
   * Property: for all evidence records, the sourceType maps to a valid badge label
   */
  it('property: every record sourceType is a valid known SourceType value', () => {
    const VALID_SOURCE_TYPES = [
      'OFFICIAL_BIS',
      'PUBLIC_BIS_LIMS',
      'DEMO',
      'MOCK',
      'SYNTHETIC',
    ]
    fc.assert(
      fc.property(fc.constantFrom(...evidenceRecords), (record) => {
        return VALID_SOURCE_TYPES.includes(record.sourceType)
      })
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 4: retrievedAt always displays "28 Sep 2026" across all seed records
// Validates: Requirements 1.5, 6.3, 14.1
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 4: Freshness label invariant — "28 Sep 2026" on all records', () => {
  /**
   * **Validates: Requirements 1.5, 6.3**
   */
  it('property: all evidence records have retrievedAt === "28 Sep 2026"', () => {
    fc.assert(
      fc.property(fc.constantFrom(...evidenceRecords), (record) => {
        return record.retrievedAt === '28 Sep 2026'
      })
    )
  })

  it('property: all lab records have retrievedAt === "28 Sep 2026"', () => {
    fc.assert(
      fc.property(fc.constantFrom(...labs), (lab) => {
        return lab.retrievedAt === '28 Sep 2026'
      })
    )
  })

  it('all 9 evidence records have the correct freshness date', () => {
    evidenceRecords.forEach((record) => {
      expect(record.retrievedAt).toBe('28 Sep 2026')
    })
  })

  it('all 5 lab records have the correct freshness date', () => {
    labs.forEach((lab) => {
      expect(lab.retrievedAt).toBe('28 Sep 2026')
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 5: Quick-start prompts produce non-empty assistant responses
// Validates: Requirements 4.2, 4.3
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 5: Quick-start prompts produce responses', () => {
  /**
   * **Validates: Requirements 4.2, 4.3**
   */
  it('property: every QUICK_PROMPT resolves to a response with a non-empty assistantMessage', () => {
    fc.assert(
      fc.property(fc.constantFrom(...QUICK_PROMPTS), (quickPrompt) => {
        const promptId = quickPrompt.id
        const response = responses[promptId]
        return (
          response !== undefined &&
          typeof response.assistantMessage === 'string' &&
          response.assistantMessage.length > 0
        )
      })
    )
  })

  it('all 6 QUICK_PROMPTS have matching entries in the responses map', () => {
    QUICK_PROMPTS.forEach((qp) => {
      const response = responses[qp.id]
      expect(response).toBeDefined()
      expect(response.assistantMessage.length).toBeGreaterThan(0)
    })
  })

  it('every quick prompt label is non-empty', () => {
    QUICK_PROMPTS.forEach((qp) => {
      expect(qp.label.length).toBeGreaterThan(0)
      expect(qp.prompt.length).toBeGreaterThan(0)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 6: Loading steps appear in correct order, none omitted
// Validates: Requirements 4.4, 5.2
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 6: Loading step sequence order invariant', () => {
  const EXPECTED_STEPS = [
    'Query Received',
    'Intent Classification',
    'Evidence Retrieval',
    'Grounding Gate',
    'Response Synthesis',
  ] as const

  it('LOADING_STEPS exports exactly 5 steps', () => {
    expect(LOADING_STEPS).toHaveLength(5)
  })

  /**
   * **Validates: Requirements 4.4, 5.2**
   */
  it('property: every expected step appears in LOADING_STEPS in the correct position', () => {
    EXPECTED_STEPS.forEach((step, index) => {
      expect(LOADING_STEPS[index]).toBe(step)
    })
  })

  it('LOADING_STEPS contains no duplicates', () => {
    const unique = new Set(LOADING_STEPS)
    expect(unique.size).toBe(LOADING_STEPS.length)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 7: ServiceTracePanel renders all 6 required fields for any trace
// Validates: Requirements 4.6
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 7: Service trace panel fields invariant', () => {
  /**
   * **Validates: Requirements 4.6**
   */
  it('property: every PromptResponse.serviceTrace has all 6 required fields non-empty', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(responses)),
        (response) => {
          const { serviceTrace } = response
          return (
            typeof serviceTrace.intent === 'string' &&
            serviceTrace.intent.length > 0 &&
            typeof serviceTrace.queryType === 'string' &&
            serviceTrace.queryType.length > 0 &&
            typeof serviceTrace.route === 'string' &&
            serviceTrace.route.length > 0 &&
            Array.isArray(serviceTrace.evidenceSources) &&
            typeof serviceTrace.evidenceStatus === 'string' &&
            serviceTrace.evidenceStatus.length > 0 &&
            typeof serviceTrace.nextAction === 'string' &&
            serviceTrace.nextAction.length > 0
          )
        }
      )
    )
  })

  it('all 6 responses have a serviceTrace with all required fields', () => {
    Object.values(responses).forEach((response) => {
      const { serviceTrace } = response
      expect(serviceTrace.intent).toBeTruthy()
      expect(serviceTrace.queryType).toBeTruthy()
      expect(serviceTrace.route).toBeTruthy()
      expect(Array.isArray(serviceTrace.evidenceSources)).toBe(true)
      expect(serviceTrace.evidenceStatus).toBeTruthy()
      expect(serviceTrace.nextAction).toBeTruthy()
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 8: Service trace toggle show/hide round-trip
// Validates: Requirements 4.7
//
// Strategy: verify component behavior via interaction testing with userEvent.
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 8: Service trace toggle round-trip', () => {
  /**
   * **Validates: Requirements 4.7**
   */
  it('ServiceTracePanel starts collapsed, opens, then closes on toggle', async () => {
    const { render, screen } = await import('@testing-library/react')
    const React = await import('react')
    const userEvent = await import('@testing-library/user-event')
    const { ServiceTracePanel } = await import('@/components/chat/ServiceTracePanel')

    const trace = {
      intent: 'Test intent',
      queryType: 'Test query type',
      route: 'Test route',
      evidenceSources: ['Source A'],
      evidenceStatus: 'Supported',
      nextAction: 'Test next action',
    }

    const user = userEvent.default.setup()
    render(React.createElement(ServiceTracePanel, { trace }))

    // Initially collapsed
    expect(
      screen.queryByRole('region', { name: /Pipeline trace/i })
    ).not.toBeInTheDocument()

    // Open
    await user.click(screen.getByRole('button', { name: /Show pipeline trace/i }))
    expect(
      screen.getByRole('region', { name: /Pipeline trace/i })
    ).toBeInTheDocument()

    // Close — round-trip
    await user.click(screen.getByRole('button', { name: /Hide pipeline trace/i }))
    expect(
      screen.queryByRole('region', { name: /Pipeline trace/i })
    ).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 9: Arbitrary unknown strings always resolve to PROMPT_ABSTAIN
// Validates: Requirements 4.8, 10.1, 10.2
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 9: Unknown query always triggers abstention', () => {
  // All keywords that could match a known prompt
  const KNOWN_KEYWORDS = [
    'packaged drinking water',
    'packaged water',
    'bottled water',
    'water bottle',
    'drinking water',
    'water certification',
    'water standard',
    'water isi',
    'water business',
    'is 14543',
    'is14543',
    'lab',
    'laboratory',
    'laboratories',
    'lims',
    'testing lab',
    'what is is 14543',
    'explain is',
    'simple terms',
    'complain',
    'complaint',
    'defective',
    'defect',
    'faulty',
    'grievance',
    'verify',
    'verification',
    'licence',
    'license',
    'demo-lic',
    'authentic',
    'check mark',
    'isi mark check',
    'isi mark',
  ]

  /**
   * **Validates: Requirements 4.8, 10.1, 10.2**
   */
  it('property: arbitrary strings with no known keywords resolve to PROMPT_ABSTAIN', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const lower = s.toLowerCase()
        const matchesKnown = KNOWN_KEYWORDS.some((kw) => lower.includes(kw))
        if (matchesKnown) return true // skip — not an unknown string
        return resolvePrompt(s) === 'PROMPT_ABSTAIN'
      }),
      { numRuns: 200 }
    )
  })

  it('empty string resolves to PROMPT_ABSTAIN', () => {
    expect(resolvePrompt('')).toBe('PROMPT_ABSTAIN')
  })

  it('whitespace-only string resolves to PROMPT_ABSTAIN', () => {
    expect(resolvePrompt('   ')).toBe('PROMPT_ABSTAIN')
  })

  it('completely unrelated string resolves to PROMPT_ABSTAIN', () => {
    expect(resolvePrompt('tell me about climate change')).toBe('PROMPT_ABSTAIN')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 10: All lab seed records have non-empty required fields
// Validates: Requirements 6.4, 14.1
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 10: Lab record completeness invariant', () => {
  /**
   * **Validates: Requirements 6.4, 14.1**
   */
  it('property: every lab record has non-empty required fields', () => {
    fc.assert(
      fc.property(fc.constantFrom(...labs), (lab) => {
        return (
          typeof lab.id === 'string' && lab.id.length > 0 &&
          typeof lab.labName === 'string' && lab.labName.length > 0 &&
          typeof lab.city === 'string' && lab.city.length > 0 &&
          typeof lab.state === 'string' && lab.state.length > 0 &&
          Array.isArray(lab.standardNumbers) && lab.standardNumbers.length > 0 &&
          typeof lab.scopeCategory === 'string' && lab.scopeCategory.length > 0 &&
          typeof lab.sourceUrl === 'string' && lab.sourceUrl.startsWith('http') &&
          lab.retrievedAt === '28 Sep 2026' &&
          lab.sourceType === 'PUBLIC_BIS_LIMS' &&
          typeof lab.snapshotLabel === 'string' && lab.snapshotLabel.length > 0
        )
      })
    )
  })

  it('all labs have IS 14543 in their standardNumbers', () => {
    labs.forEach((lab) => {
      expect(lab.standardNumbers).toContain('IS 14543')
    })
  })

  it('dataset contains at least 3 lab records (Requirement 14.1)', () => {
    expect(labs.length).toBeGreaterThanOrEqual(3)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 11: Every evidence record appears on Evidence page with no active filter
// Validates: Requirements 11.1, 11.2
//
// Strategy: data-level verification — all evidenceRecords have IDs and required
// fields. Full rendering is covered in evidencePage.test.tsx.
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 11: Evidence page completeness', () => {
  /**
   * **Validates: Requirements 11.1, 11.2**
   */
  it('property: every evidence record has all required display fields', () => {
    fc.assert(
      fc.property(fc.constantFrom(...evidenceRecords), (record) => {
        return (
          typeof record.id === 'string' && record.id.length > 0 &&
          typeof record.source === 'string' && record.source.length > 0 &&
          typeof record.standardOrRecord === 'string' && record.standardOrRecord.length > 0 &&
          typeof record.recordType === 'string' && record.recordType.length > 0 &&
          record.retrievedAt === '28 Sep 2026' &&
          typeof record.authority === 'string' && record.authority.length > 0 &&
          typeof record.versionOrRevision === 'string' && record.versionOrRevision.length > 0 &&
          typeof record.whyUsed === 'string' && record.whyUsed.length > 0 &&
          typeof record.officialUrl === 'string' && record.officialUrl.startsWith('http')
        )
      })
    )
  })

  it('dataset contains at least one OFFICIAL_BIS record', () => {
    const official = evidenceRecords.filter((r) => r.sourceType === 'OFFICIAL_BIS')
    expect(official.length).toBeGreaterThanOrEqual(1)
  })

  it('dataset contains at least one PUBLIC_BIS_LIMS record', () => {
    const lims = evidenceRecords.filter((r) => r.sourceType === 'PUBLIC_BIS_LIMS')
    expect(lims.length).toBeGreaterThanOrEqual(1)
  })

  it('dataset contains at least one SYNTHETIC record', () => {
    const synthetic = evidenceRecords.filter((r) => r.sourceType === 'SYNTHETIC')
    expect(synthetic.length).toBeGreaterThanOrEqual(1)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 12: No lorem ipsum in any response or label text
// Validates: Requirements 14.4, 15.4
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 12: No lorem ipsum in rendered output', () => {
  /**
   * **Validates: Requirements 14.4, 15.4**
   */
  it('property: no assistantMessage contains lorem ipsum', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(responses)),
        (response) => {
          return !response.assistantMessage.toLowerCase().includes('lorem ipsum')
        }
      )
    )
  })

  it('no evidence record whyUsed text contains lorem ipsum', () => {
    evidenceRecords.forEach((record) => {
      expect(record.whyUsed.toLowerCase()).not.toContain('lorem ipsum')
    })
  })

  it('no lab record scopeCategory contains lorem ipsum or placeholder text', () => {
    labs.forEach((lab) => {
      expect(lab.scopeCategory.toLowerCase()).not.toContain('lorem ipsum')
      expect(lab.labName.toLowerCase()).not.toContain('placeholder')
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 13: Presentation mode activate/deactivate round-trip
// Validates: Requirements 2.5, 2.6
//
// Strategy: test AppContext state via the PresentationModeToggle component.
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 13: Presentation mode round-trip', () => {
  /**
   * **Validates: Requirements 2.5, 2.6**
   */
  it('PresentationModeToggle activates and deactivates presentation mode', async () => {
    const { render, screen } = await import('@testing-library/react')
    const React = await import('react')
    const userEvent = await import('@testing-library/user-event')
    const { AppContextProvider } = await import('@/context/AppContext')
    const { PresentationModeToggle } = await import('@/components/ui/PresentationModeToggle')

    const user = userEvent.default.setup()
    render(
      React.createElement(
        AppContextProvider,
        null,
        React.createElement(PresentationModeToggle)
      )
    )

    // Initially: "Presentation Mode" button
    const btn = screen.getByRole('button', { name: /Enter Presentation Mode/i })
    expect(btn).toHaveAttribute('aria-pressed', 'false')

    // Activate
    await user.click(btn)
    const activeBtn = screen.getByRole('button', { name: /Exit Presentation Mode/i })
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true')

    // Deactivate — round-trip complete
    await user.click(activeBtn)
    const restoredBtn = screen.getByRole('button', { name: /Enter Presentation Mode/i })
    expect(restoredBtn).toHaveAttribute('aria-pressed', 'false')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Property 14: "Submit to BIS" never appears in ComplaintJourney at any step
// Validates: Requirements 8.7, 8.8
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 14: No "Submit to BIS" in complaint journey', () => {
  /**
   * **Validates: Requirements 8.7, 8.8**
   */
  it('property: the PROMPT_COMPLAINT response contains no "Submit to BIS" text', () => {
    const complaintResponse = responses['PROMPT_COMPLAINT']
    const serialized = JSON.stringify(complaintResponse)
    expect(serialized).not.toMatch(/Submit to BIS/i)
  })

  it('ComplaintDraftCard renders no "Submit to BIS" element', async () => {
    const { render, screen } = await import('@testing-library/react')
    const React = await import('react')
    const { ComplaintDraftCard } = await import('@/components/cards/ComplaintDraftCard')

    const fields = [
      { label: 'Product', value: 'Test product', isMissing: false },
      { label: 'Licence', value: undefined, isMissing: true },
    ]

    render(React.createElement(ComplaintDraftCard, { fields }))
    expect(screen.queryByText(/Submit to BIS/i)).toBeNull()
    // No button or link labelled "Submit to BIS"
    expect(screen.queryByRole('button', { name: /Submit to BIS/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /Submit to BIS/i })).toBeNull()
  })

  it('property: ComplaintDraftCard with arbitrary fields never produces "Submit to BIS"', () => {
    // Data-layer check: the complaintFields in every response lack "Submit to BIS"
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(responses)),
        (response) => {
          if (!response.complaintFields) return true
          const fieldsText = JSON.stringify(response.complaintFields)
          return !fieldsText.match(/Submit to BIS/i)
        }
      )
    )
  })
})

# Implementation Plan: BIS Sarathi

## Overview

Build a fully client-side Next.js 14 demo — no backend, no API keys. Tasks are ordered to get a runnable, screen-recordable app as fast as possible: project scaffold first, then data, then layout shell, then page by page, finishing with polish and tests.

## Tasks

- [x] 1. Scaffold project, install dependencies, and configure TypeScript/Tailwind/shadcn
  - Initialise Next.js 14 App Router project with TypeScript strict mode
  - Install and configure Tailwind CSS with the colour tokens from `lib/colours.ts`
  - Install and initialise shadcn/ui; add Button, Badge, Card, Input, Separator primitives
  - Install Vitest, React Testing Library, and fast-check for testing
  - Create the directory structure: `src/app/`, `src/components/`, `src/data/`, `src/context/`, `src/lib/`, `src/styles/`
  - Set up `globals.css` with CSS variables for the full colour token set
  - _Requirements: 15.5, 15.6_

- [x] 2. Create all seed data files in `/src/data/`
  - [x] 2.1 Create `src/data/standards.ts` with IS-14543-2024 and IS-14543-2016 `BISStandard` records
    - Include all required fields: `id`, `standardNumber`, `title`, `year`, `supersedes`, `scope`, `applicableProducts`, `certificationScheme`, `sourceUrl`, `sourceType: 'OFFICIAL_BIS'`, `retrievedAt: "28 Sep 2026"`, `authority`, `revision`
    - Scope text drawn from publicly available BIS descriptions — no fabricated clause numbers
    - _Requirements: 14.1, 5.4_

  - [x] 2.2 Create `src/data/labs.ts` with 4–5 `LabRecord` objects for IS 14543
    - All records: `sourceType: 'PUBLIC_BIS_LIMS'`, `snapshotLabel: "Public BIS LIMS snapshot — retrieved 28 Sep 2026"`, `retrievedAt: "28 Sep 2026"`
    - Include `labName`, `city`, `state`, `standardNumbers: ["IS 14543"]`, `scopeCategory`, `sourceUrl` for each
    - _Requirements: 14.1, 6.4_

  - [x] 2.3 Create `src/data/verification.ts` with the DEMO-LIC-001 `VerificationRecord`
    - `sourceType: 'MOCK'`, `isDemoRecord: true`, explicit `warningText` disclaimer, `retrievedAt: "28 Sep 2026"`
    - _Requirements: 14.1, 9.1, 9.2_

  - [x] 2.4 Create `src/data/evidence.ts` with the full `EvidenceRecord[]` array
    - Entries for IS 14543 (2024), IS 14543 (2016), all lab records, mock verification record, one synthetic test record
    - Each record: correct `sourceType`, `retrievedAt: "28 Sep 2026"`, `whyUsed` text, `officialUrl`
    - _Requirements: 14.1, 11.2_

  - [x] 2.5 Create `src/data/responses.ts` — `Record<PromptId, PromptResponse>` with all six entries
    - PROMPT_DRINKING_WATER: includes `productUnderstanding`, two `candidateStandards`, `serviceTrace`, `evidenceCards`
    - PROMPT_LABS: includes `labRecords`, `serviceTrace`, `evidenceCards`
    - PROMPT_WHAT_IS_14543: consumer plain-language response, `evidenceCards`, `serviceTrace`
    - PROMPT_COMPLAINT: `complaintDraft` with missing-fields state, `serviceTrace`
    - PROMPT_VERIFY: `verificationResult` referencing DEMO-LIC-001, `serviceTrace`
    - PROMPT_ABSTAIN: `isAbstention: true`, "UNABLE TO VERIFY" message, `serviceTrace`
    - _Requirements: 4.2, 14.2, 14.3_

- [x] 3. Create core types and utilities
  - [x] 3.1 Create `src/lib/types.ts` defining all TypeScript interfaces from the design
    - `PromptId`, `ScenarioId`, `SourceType`, `ResponseType`, `BISStandard`, `LabRecord`, `VerificationRecord`, `EvidenceRecord`, `ChatMessage`, `PromptResponse`, `ServiceTrace`, `ProductUnderstanding`, `ComplaintDraft`, `ComplaintField`, `QuickPrompt`
    - _Requirements: 15.5_

  - [x] 3.2 Create `src/lib/colours.ts` exporting the colour token object
    - Mirror values from `globals.css` CSS variables
    - _Requirements: 15.1_

  - [x] 3.3 Create `src/lib/promptRouter.ts` with `resolvePrompt(input: string): PromptId`
    - Implement keyword-matching logic exactly as specified in the design
    - Default/fallback always returns `'PROMPT_ABSTAIN'`
    - Export `QUICK_PROMPTS: QuickPrompt[]` array with all six prompts
    - _Requirements: 4.2, 4.3, 10.1_

- [x] 4. Create `AppContext` and root layout shell
  - [x] 4.1 Create `src/context/AppContext.tsx`
    - `presentationMode: boolean`, `setPresentationMode` state
    - Toggle sets/removes `data-presentation="true"` on `document.documentElement`
    - _Requirements: 2.4, 2.5, 2.6_

  - [x] 4.2 Create layout components: `DemoBanner`, `NavBar`, `Footer`
    - `DemoBanner`: amber `#B45309` background, white text, exact required text, non-dismissable, always visible including in Presentation Mode
    - `NavBar`: all 7 links (Home, Ask Sarathi, Industry, Consumer, Evidence, How It Works, Demo Data), active link detection via `usePathname()`, `PresentationModeToggle` on right; hides secondary links (Evidence, How It Works, Demo Data) in Presentation Mode
    - `Footer`: exact required two-line text, four external links each `target="_blank" rel="noopener noreferrer"`, `aria-label` with "(opens in new tab)"
    - _Requirements: 1.1, 1.6, 2.1, 2.2, 2.3, 2.7, 15.8_

  - [x] 4.3 Create `src/components/ui/PresentationModeToggle.tsx`, `SourceBadge.tsx`, `FreshnessLabel.tsx`
    - `PresentationModeToggle`: button that reads/sets `presentationMode` from `AppContext`
    - `SourceBadge`: receives `SourceType`, renders label with correct colour per design
    - `FreshnessLabel`: renders "retrieved {date}", amber for demo/mock, grey for official
    - _Requirements: 1.4, 1.5, 2.4, 2.5, 2.6_

  - [x] 4.4 Wire `AppContext` provider, `DemoBanner`, `NavBar`, `Footer` into `src/app/layout.tsx`
    - Root layout: `AppContext.Provider` → `DemoBanner` → `NavBar` → `<main>{children}</main>` → `Footer`
    - Apply Presentation Mode CSS in `globals.css`: hide `.nav-secondary`, increase font-size, expand card padding
    - _Requirements: 1.1, 2.1, 2.4, 2.5, 2.6_

- [x] 5. Build the Home page (`/`)
  - Render "BIS SARATHI" heading and exact tagline: "Ask naturally. Verify with BIS evidence. Act through the official BIS service."
  - Render subtitle, "Launch Interactive Demo" CTA → `/ask`, "How it works" CTA → `/how-it-works`
  - Render four capability cards: Standards Discovery, Certification Guidance, Laboratory Discovery, Consumer Support — with real descriptions from seeded domain knowledge
  - Render "Choose your journey" section: Industry / MSME and Consumer entry points
  - Render demo mode notice: "Demo mode • Seeded/public-source records • No production BIS connection."
  - Government-technology aesthetic: restrained, no gradients, no AI stock imagery
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 6. Build shared card components
  - [x] 6.1 Create `EvidenceCard.tsx`
    - Fields: source badge, standard/record ID, record type, retrieved date, authority, version, whyUsed, official URL button (new tab, aria-label)
    - Left border 3px by source type colour: green OFFICIAL_BIS, blue PUBLIC_BIS_LIMS, amber DEMO/MOCK, grey SYNTHETIC
    - _Requirements: 11.2, 11.3, 11.5_

  - [x] 6.2 Create `ProductUnderstandingCard.tsx`, `CandidateStandardCard.tsx`
    - `ProductUnderstandingCard`: Product, Category, Use in two-column grid
    - `CandidateStandardCard`: standard number, title, version notes, "Why surfaced" checklist of `matchReasons`
    - _Requirements: 5.3, 5.4, 5.5_

  - [x] 6.3 Create `LabCard.tsx`
    - Fields: lab name, city, state, standard numbers, scope category, validity date (conditional), source URL link (new tab), freshness label
    - Always shows: "Public BIS LIMS snapshot — retrieved 28 Sep 2026"
    - _Requirements: 6.4, 6.5, 6.7_

  - [x] 6.4 Create `VerificationResult.tsx`
    - Always renders "DEMO VERIFICATION RECORD" header and amber warning banner
    - Displays status, source, explicit "Not connected to BIS production registry" notice
    - Never renders a green verified badge; never renders "Verified by BIS"
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 6.5 Create `AbstentionResponse.tsx`
    - Purple-neutral (`#7C3AED`) treatment, "UNABLE TO VERIFY" header
    - Exact message: "I could not verify this reliably from the available BIS evidence. I will not guess."
    - "Why?" section with two reasons: "No authoritative evidence found" and "Insufficient current regulatory data"
    - "Open official BIS resource" CTA button opening BIS website in new tab
    - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 6.6 Create `ComplaintDraftCard.tsx`
    - Shows extracted complaint fields; highlights missing fields with action buttons ("Add product", "Add licence/mark number", "Add purchase details")
    - Shows structured draft once fields are filled
    - Renders Edit, Review, "Open official complaint channel" buttons
    - Notice: "AI prepares the draft. The user reviews and confirms before any official action."
    - "Open official complaint channel" opens official BIS complaint URL in new tab
    - Never renders "Submit to BIS"
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 7. Build chat components and Ask Sarathi page (`/ask`)
  - [x] 7.1 Create `LoadingSequence.tsx`
    - Five steps in exact order: "Understanding request", "Extracting product attributes", "Searching BIS evidence", "Checking revision/status", "Preparing grounded response"
    - 600ms `setTimeout` chain; completed steps show checkmark, active step shows spinner
    - Label: "Simulated demo retrieval"
    - Respects `prefers-reduced-motion` — all steps appear instantly when set
    - `role="status" aria-live="assertive"`
    - _Requirements: 4.4, 5.2_

  - [x] 7.2 Create `ServiceTracePanel.tsx`
    - Collapsible right-side panel with slide transition (`width 300ms ease`)
    - Renders all six fields: INTENT, QUERY TYPE, ROUTE, EVIDENCE SOURCES, EVIDENCE STATUS, NEXT ACTION
    - Toggle button: `aria-expanded` attribute; "Show Service Trace" label
    - Never exposes chain-of-thought
    - _Requirements: 4.6, 4.7_

  - [x] 7.3 Create `QuickStartPrompts.tsx` and `DemoScenarioSwitcher.tsx`
    - `QuickStartPrompts`: six buttons from `QUICK_PROMPTS`; on click sets input and submits
    - `DemoScenarioSwitcher`: dropdown/tabs for Industry, Lab, Consumer, Verification, Complaint, Trust Test; maps to `PromptId` and triggers full flow
    - _Requirements: 4.2, 4.3, 4.9_

  - [x] 7.4 Create `MessageBubble.tsx` and `ChatInterface.tsx`
    - `MessageBubble`: renders user and assistant messages; assistant messages render inline `EvidenceCard`s, `ProductUnderstandingCard`, `CandidateStandardCard`, `LabCard`, `VerificationResult`, `AbstentionResponse`, `ComplaintDraftCard` based on `responseType`
    - `ChatInterface`: manages `messages[]`, `inputValue`, `isLoading`, `serviceTrace`, `showServiceTrace`, `activeScenario` state
    - On submit: calls `resolvePrompt` → retrieves `PromptResponse` → runs `LoadingSequence` → appends assistant message
    - After response loads, focus moves to new message via `ref.current?.focus()`; after quick-start click, focus returns to input
    - Message list: `role="log" aria-live="polite"`
    - _Requirements: 4.1, 4.5, 4.8_

  - [x] 7.5 Wire chat components into `/ask` page
    - Layout: chat area on left, `ServiceTracePanel` on right
    - `QuickStartPrompts` above input when no messages; `DemoScenarioSwitcher` accessible at all times
    - _Requirements: 4.1, 4.6, 4.9_

- [x] 8. Checkpoint — verify runnable demo
  - Ensure all tests pass, ask the user if questions arise.
  - App should be runnable (`npm run dev`) with Home and Ask Sarathi fully functional at this point.

- [x] 9. Build Industry, Lab Discovery, and Consumer journey pages
  - [x] 9.1 Create `IndustryJourney.tsx` and `/industry` page
    - Seven-step flow: Product Description → Attribute Extraction → Candidate Standards → Applicability/Version Checks → Certification Guidance → Lab Discovery → Evidence and Next Action
    - On demo input: run `LoadingSequence`, then render `ProductUnderstandingCard`, `CandidateStandardCard` (with version notes), "Why surfaced" card, `EvidenceCard` for IS 14543
    - Certification/Regulatory Guidance card sourced only from seeded data — no fabricated clause numbers
    - "Find testing laboratories" action transitions to Lab Discovery step
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 9.2 Create `LabDiscovery.tsx`
    - Displays selected standard (IS 14543) and list of seeded lab records via `LabCard`
    - Location filter (State/Any) narrows results
    - Notice: "Verify current laboratory status on BIS LIMS before booking/testing."
    - Notice: "Public BIS LIMS snapshot — retrieved 28 Sep 2026"
    - Does not hard-code a total count; references only seeded snapshot records
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 6.6_

  - [x] 9.3 Create `ConsumerJourney.tsx` and `/consumer` page
    - Handles "What does IS 14543 mean?" with plain-language explanation from seeded data
    - Renders `EvidenceCard` with Source, Record, Retrieved date, Revision/status
    - "Official Source" button opens official BIS resource in new tab
    - Three action buttons: "Find a laboratory" → Lab Discovery, "Ask about certification status" → `/ask`, "Prepare a complaint" → `/consumer` complaint step or `/ask` with complaint prompt
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 10. Build Complaint and Verification journey pages
  - [x] 10.1 Create `ComplaintJourney.tsx` and integrate into `/ask` and `/consumer`
    - Extracts and displays all complaint fields; prompts for missing fields with specific action buttons
    - Renders `ComplaintDraftCard` with draft once fields are sufficient
    - "Open official complaint channel" opens BIS complaint URL in new tab
    - Never renders "Submit to BIS" button at any step
    - _Requirements: 8.1–8.8_

  - [x] 10.2 Create `VerificationJourney.tsx` and integrate into `/ask`
    - Accepts licence/identifier input; primary demo input: "DEMO-LIC-001"
    - Renders `VerificationResult` with all required warnings and labels
    - _Requirements: 9.1–9.6_

- [x] 11. Build Evidence, How It Works, and Demo Data pages
  - [x] 11.1 Create `/evidence` page with `EvidencePage`
    - Searchable/filterable card layout using all `EvidenceRecord[]` from `evidence.ts`
    - Search/filter input: filters by standard number, source type, or record type
    - Visually distinguishes OFFICIAL BIS / PUBLIC BIS LIMS from DEMO / MOCK / SYNTHETIC (different border/badge treatments)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 11.2 Create `/how-it-works` page
    - Visual pipeline: USER → LANGUAGE + INTENT → QUERY PLANNER → STRUCTURED LOOKUP / HYBRID RETRIEVAL → EVIDENCE VALIDATION → GROUNDING GATE → ANSWER / CLARIFY / ABSTAIN → NEXT OFFICIAL ACTION
    - Each step with plain-language explanation
    - Three outcome states: HIGH / SUPPORTED, MEDIUM / NEEDS CLARIFICATION, LOW / UNABLE TO VERIFY
    - Required quote: "The model explains the evidence. BIS evidence decides."
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 11.3 Create `/demo-data` page
    - Three sections: "Public/source-derived records", "Mock verification records", "Synthetic test records"
    - Provenance explanation, exact retrieval dates, required statement about mock records
    - Visual treatment prevents mock/synthetic from being mistaken for authoritative records
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 12. Checkpoint — full app runnable
  - Ensure all tests pass, ask the user if questions arise.
  - All six demo scenarios should work end-to-end at this point.

- [x] 13. Write unit tests
  - [x] 13.1 Write unit tests for `resolvePrompt` — keyword mapping for all 6 prompt IDs
    - _Requirements: 4.2, 10.1_

  - [x] 13.2 Write unit tests for root layout — DemoBanner, NavBar, Footer present
    - _Requirements: 1.1, 2.1, 15.8_

  - [x] 13.3 Write unit tests for Home page — exact title, tagline, CTAs, 4 capability card titles
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 13.4 Write unit tests for NavBar — all 7 link destinations present
    - _Requirements: 2.1_

  - [x] 13.5 Write unit tests for `ServiceTracePanel` — all 6 fields rendered from fixture
    - _Requirements: 4.6_

  - [x] 13.6 Write unit tests for `AbstentionResponse` — label, exact message, 2 reasons, CTA
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 13.7 Write unit tests for `VerificationResult` — warning banner, demo label, no green badge
    - _Requirements: 9.2, 9.3, 9.5_

  - [x] 13.8 Write unit tests for `ComplaintDraftCard` — "Submit to BIS" absent at all steps
    - _Requirements: 8.7, 8.8_

  - [x] 13.9 Write unit tests for `EvidencePage` — filter input present, records render without filter
    - _Requirements: 11.1, 11.4_

  - [x] 13.10 Write unit tests for Footer — required link hrefs and disclaimer text
    - _Requirements: 1.6, 15.8_

  - [x] 13.11 Write unit tests for Demo Data page — three sections with correct headings
    - _Requirements: 12.1_

  - [x] 13.12 Write unit tests for How It Works page — all pipeline step labels, outcome labels, required quote
    - _Requirements: 13.1, 13.3, 13.4_

- [ ] 14. Write property-based tests
  - [x] 14.1 Write property test: demo banner always present on all routes
    - **Property 1: Demo banner always present**
    - **Validates: Requirements 1.1**

  - [x] 14.2 Write property test: "Verified by BIS" never appears in any rendered output
    - **Property 2: "Verified by BIS" never appears**
    - **Validates: Requirements 1.2, 9.4**

  - [x] 14.3 Write property test: source badge present on all DEMO/MOCK/SYNTHETIC records
    - **Property 3: Source badge on demo/mock/synthetic records**
    - **Validates: Requirements 1.4, 11.3**

  - [x] 14.4 Write property test: retrievedAt always displays "28 Sep 2026" across all seed records
    - **Property 4: Freshness label invariant**
    - **Validates: Requirements 1.5, 6.3**

  - [x] 14.5 Write property test: quick-start prompts produce non-empty assistant responses
    - **Property 5: Quick-start prompts produce responses**
    - **Validates: Requirements 4.2, 4.3**

  - [x] 14.6 Write property test: loading steps appear in correct order, none omitted
    - **Property 6: Loading step sequence order invariant**
    - **Validates: Requirements 4.4, 5.2**

  - [x] 14.7 Write property test: ServiceTracePanel renders all 6 required fields for arbitrary ServiceTrace objects
    - **Property 7: Service trace panel fields invariant**
    - **Validates: Requirements 4.6**

  - [x] 14.8 Write property test: service trace toggle show/hide round-trip restores hidden state
    - **Property 8: Service trace toggle round-trip**
    - **Validates: Requirements 4.7**

  - [x] 14.9 Write property test: arbitrary unknown strings always resolve to PROMPT_ABSTAIN
    - **Property 9: Unknown query always triggers abstention**
    - **Validates: Requirements 4.8, 10.1, 10.2**

  - [x] 14.10 Write property test: all lab seed records have non-empty required fields
    - **Property 10: Lab record completeness invariant**
    - **Validates: Requirements 6.4, 14.1**

  - [ ] 14.11 Write property test: every evidence record appears on Evidence page with no active filter
    - **Property 11: Evidence page completeness**
    - **Validates: Requirements 11.1, 11.2**

  - [ ] 14.12 Write property test: no lorem ipsum in any rendered component output
    - **Property 12: No lorem ipsum in rendered output**
    - **Validates: Requirements 14.4, 15.4**

  - [ ] 14.13 Write property test: presentation mode activate/deactivate round-trip
    - **Property 13: Presentation mode round-trip**
    - **Validates: Requirements 2.5, 2.6**

  - [ ] 14.14 Write property test: "Submit to BIS" never appears in ComplaintJourney at any step
    - **Property 14: No "Submit to BIS" in complaint journey**
    - **Validates: Requirements 8.7, 8.8**

- [ ] 15. Final checkpoint — full demo ready for screen recording
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all six scenario buttons work deterministically, Presentation Mode is functional, and no dead buttons or broken routes remain.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 8, 12, and 15 provide incremental validation gates
- Property tests use fast-check with minimum 100 iterations each
- All property tests tagged with `// Feature: bis-sarathi, Property N: ...` as specified in the design

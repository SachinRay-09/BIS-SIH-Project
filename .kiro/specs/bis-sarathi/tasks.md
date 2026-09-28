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

- [x] 14. Write property-based tests
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

  - [x] 14.11 Write property test: every evidence record appears on Evidence page with no active filter
    - **Property 11: Evidence page completeness**
    - **Validates: Requirements 11.1, 11.2**

  - [x] 14.12 Write property test: no lorem ipsum in any rendered component output
    - **Property 12: No lorem ipsum in rendered output**
    - **Validates: Requirements 14.4, 15.4**

  - [x] 14.13 Write property test: presentation mode activate/deactivate round-trip
    - **Property 13: Presentation mode round-trip**
    - **Validates: Requirements 2.5, 2.6**

  - [x] 14.14 Write property test: "Submit to BIS" never appears in ComplaintJourney at any step
    - **Property 14: No "Submit to BIS" in complaint journey**
    - **Validates: Requirements 8.7, 8.8**

- [x] 15. Final checkpoint — full demo ready for screen recording
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all six scenario buttons work deterministically, Presentation Mode is functional, and no dead buttons or broken routes remain.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 8, 12, and 15 provide incremental validation gates
- Property tests use fast-check with minimum 100 iterations each
- All property tests tagged with `// Feature: bis-sarathi, Property N: ...` as specified in the design

---

## Post-MVP Improvements (based on SIH_2026_v2_Improved.md gap analysis)

These tasks improve the demo to better reflect the evidence-first architecture described in the v2 design doc.
Tasks are grouped by area and ordered by demo/judge impact.

---

### A. Confidence & Grounding Model

- [x] A.1 Expand confidence score breakdown in ServiceTracePanel
  - Currently shows a single `confidenceScore` number (0–100). Expand to show the component scores from the v2 grounding model:
    - Retrieval relevance, Source authority, Entity identifier match, Evidence coverage, Freshness/version validity, Cross-source agreement, Ambiguity penalty
  - Render as a mini breakdown table inside the expanded pipeline trace panel
  - _Ref: SIH v2 § 12.1 Proposed grounding score_

- [x] A.2 Show confidence state label alongside score in ServiceTracePanel
  - HIGH (≥80) / MEDIUM (50–79) / LOW (<50) labels already shown in MessageBubble badge
  - Also show them in the pipeline trace panel with a one-line rationale per state
  - _Ref: SIH v2 § 12.2 Output states_

- [x] A.3 Add "Clarification needed" state to COMPLAINT and VERIFICATION responses
  - COMPLAINT (score 71) and VERIFY (score 55) are MEDIUM — they should explicitly show a "Needs clarification" notice in the response rather than just showing the card
  - Add a yellow notice banner: "This response requires additional information before it can be fully grounded"
  - _Ref: SIH v2 § 12.2, § 4.2 Consumer persona_

---

### B. Standards Recommendation Engine

- [x] B.1 Add `applicabilityStatus` field to CandidateStandard and display it on CandidateStandardCard
  - Values: `"candidate"` | `"verified"` | `"uncertain"`
  - IS 14543:2024 → `"verified"` (exact product-category match, CRS mandatory)
  - IS 14543:2016 → `"candidate"` (superseded; surfaced for version awareness)
  - Render as a coloured badge: verified=green, candidate=blue, uncertain=amber
  - _Ref: SIH v2 § 8.3 Output contract_

- [x] B.2 Add `clarificationsNeeded` field to CandidateStandard
  - IS 14543:2024 example: `["confirm intended capacity range", "confirm whether natural mineral water is excluded"]`
  - Render as a "What I still need" section below matchReasons in CandidateStandardCard
  - _Ref: SIH v2 § 8.3, § 4.1 Industry flow_

- [x] B.3 Add a "Certification route" card to the Industry journey response
  - Show: Scheme (CRS), Mark (ISI), Mandatory/Voluntary, Required testing path
  - Source purely from seeded data — no fabricated clause numbers
  - _Ref: SIH v2 § 4.1, § 8.3 certificationRoute field_

---

### C. Home Page & Navigation UX

- [x] C.1 Revamp Home page hero to match SIH v2 § 30 Recommended Product UI
  - Replace current generic CTA buttons with four direct action tiles:
    - "Find my standard" → `/industry`
    - "Understand certification" → `/industry`
    - "Find a testing laboratory" → `/industry` (lab step)
    - "Ask about BIS" → `/ask`
  - Add a product description input field on the home page that pre-fills `/ask` and auto-submits
  - Keep the Government-technology aesthetic — no gradients or AI stock imagery
  - _Ref: SIH v2 § 30_

- [x] C.2 Add a "Result summary" section on the Home page showing what the last scenario produced
  - Visible after a user navigates back from `/ask` — shows a one-line summary of last scenario used
  - Or replace with a "Try a live demo" strip with three scenario buttons directly on the home page
  - _Ref: SIH v2 § 33 Live Demo Script_

---

### D. Industry Journey Page Improvements

- [x] D.1 Add product attribute schema display to IndustryJourney
  - After "Find Standard" loads, show an extracted attribute card based on SIH v2 § 8.2:
    - product_type, material, intended_use, market_context fields rendered visually
  - Currently only ProductUnderstandingCard is shown; this adds structured attribute extraction context
  - _Ref: SIH v2 § 8.2 Product attribute schema_

- [x] D.2 Add a "What I still need" section to IndustryJourney result view
  - Seeded clarifications: "confirm container capacity", "confirm whether product is natural mineral water"
  - Rendered as an amber notice card below the candidate standard cards
  - _Ref: SIH v2 § 4.1, Slide 4 result screen_

- [x] D.3 Add explicit "Mandatory vs Candidate" distinction notice to IndustryJourney
  - A small notice box explaining the difference between:
    - **Candidate standard** — semantically similar, requires verification
    - **Verified applicable standard** — confirmed match with evidence
    - **Mandatory requirement** — legally required, e.g. under QCO/CRS
  - _Ref: SIH v2 § 8.1 "Important language rule"_

---

### E. How It Works Page Improvements

- [x] E.1 Add the full 8-stage SIH v2 architecture diagram to the How It Works page
  - Currently shows a simplified 8-stage text pipeline
  - Replace/supplement with a styled two-column layout showing the architecture from SIH v2 § 5.1:
    - Left column: USER CHANNELS → LANGUAGE + QUERY UNDERSTANDING → DETERMINISTIC QUERY PLANNER
    - Right column: HYBRID KNOWLEDGE ENGINE and STRUCTURED SERVICE CONNECTORS feeding into EVIDENCE VALIDATION → GROUNDING GATE → RESPONSE LAYER → AUDIT + FEEDBACK LOOP
  - _Ref: SIH v2 § 5.1_

- [x] E.2 Add "The LLM explains. BIS evidence decides." as the section headline
  - Currently the page uses the architecture overview heading but not this key positioning line
  - Add it as a prominent pullquote or hero line at the top of the architecture section
  - _Ref: SIH v2 § 5.2, Slide 3_

- [x] E.3 Add a Source Hierarchy / Data Tier section to How It Works
  - Tier A: Public authoritative BIS sources (Standards portal, BIS LIMS, BIS Care)
  - Tier B: Authorized BIS data (licensed text, authorized APIs — future)
  - Tier C: Supporting external sources (labelled, limited)
  - Tier D: Synthetic/demo data (never presented as authoritative)
  - Visual treatment: green → blue → amber → grey for the four tiers
  - _Ref: SIH v2 § 6.1 Source hierarchy_

---

### F. Consumer Journey Improvements

- [x] F.1 Add a "Verify ISI mark" entry point to the Consumer page
  - A text field accepting a licence/HUID number that routes to the verification flow
  - Shows the DEMO-LIC-001 result when that ID is entered, abstention for anything else
  - _Ref: SIH v2 § 4.2 Consumer persona, § 10 Verification architecture_

- [x] F.2 Add "What this IS mark means for you" explainer section to ConsumerJourney
  - After the plain-language explanation card, add a three-point consumer benefit summary:
    1. Product meets minimum safety standards
    2. Manufacturer is BIS-licensed
    3. You can complain if quality doesn't match
  - _Ref: SIH v2 § 4.2_

---

### G. Demo Data Page Improvements

- [x] G.1 Add a Data Tier classification table to the Demo Data page
  - Show all 9 evidence records grouped by tier (Tier A / Tier D) with their sourceType badges
  - Clearly separate official BIS public-source records from mock/synthetic demo records
  - Add a note: "Tier B and Tier C sources would be used in the production version"
  - _Ref: SIH v2 § 6.1, § 28 Demo Data Policy_

- [x] G.2 Add a freshness/retrieval metadata table to Demo Data page
  - For each record: record ID, source, retrieved_at, revision_year, status (current/superseded/mock)
  - _Ref: SIH v2 § 17 Data Freshness and Version Control_

---

### H. Trust / Abstention UX

- [x] H.1 Add a "Would you like help preparing the information needed for verification?" follow-up CTA to AbstentionResponse
  - Link to `/ask` with the complaint prompt pre-filled, or show a small inline prompt helper
  - _Ref: SIH v2 § 19 Responsible AI / Safe Failure_

- [x] H.2 Show a "Grounding score breakdown" notice on abstention responses
  - "Confidence: LOW (0/100) — No matching evidence found in the available BIS dataset"
  - Use the red LOW badge already in place, but add a one-line reason below it
  - _Ref: SIH v2 § 12.2_

---

### I. Vercel / Deployment Hardening

- [x] I.1 Fix 404 on page refresh — add `trailingSlash: false` and security headers to next.config.mjs
  - `trailingSlash: false` prevents URL mismatch on Vercel's CDN layer
  - Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
  - Simplified `vercel.json` to let Vercel's Next.js framework detection handle routing
  - _Completed: next.config.mjs and vercel.json updated_

- [x] I.2 Add `output: 'standalone'` to next.config.mjs for optimised Vercel cold starts
  - Reduces deployment bundle size by only including server-required files
  - _Ref: Next.js deployment best practices_

- [x] I.3 Add `robots.txt` and `sitemap.xml` to `/public/`
  - robots.txt: allow all crawlers, link to sitemap
  - sitemap.xml: list all 9 app routes with `lastmod` set to the deployment date
  - Makes the deployed site crawlable and indexable for demo purposes

---

### J. Accessibility & Polish

- [x] J.1 Add `lang` attribute region switching for screen readers on key label elements
  - IS numbers and BIS identifiers should have `lang="en"` to prevent incorrect pronunciation in screen readers if the page is ever used in an Indic language context

- [x] J.2 Add skip-to-content link at the top of the layout
  - `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>` before the DemoBanner
  - Required for keyboard-only and screen reader navigation

- [x] J.3 Add visible focus ring to all interactive cards (EvidenceCard, LabCard, CandidateStandardCard)
  - Currently hover states exist but cards used as links/buttons may lack a visible focus ring at 2px contrast ratio
  - Add `focus-visible:ring-2 focus-visible:ring-[#1B2A4A]` to all interactive card wrappers


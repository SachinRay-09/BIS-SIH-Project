# Design Document: BIS Sarathi

## Overview

BIS Sarathi is a fully client-side interactive concept demonstrator built for Smart India Hackathon 2026 (PS 26107, Team UDDAN). It simulates an evidence-first conversational service-orchestration layer over the BIS (Bureau of Indian Standards) information ecosystem.

**Core design constraint**: Zero backend. Zero API keys. Zero runtime network requests to external services. Every response is deterministic, sourced exclusively from TypeScript seed files bundled with the application.

The product must look and behave like a real government-technology tool — not a marketing page, not a generic AI chatbot wrapper. The judge must immediately see: intent recognition, structured evidence retrieval, grounded responses with source attribution, and principled abstention when evidence is unavailable.

### Design Goals

1. Demonstrate the full conversational pipeline: input → intent → evidence lookup → grounded response → official action routing
2. Maintain absolute transparency: every record carries a source badge and freshness label
3. Support six deterministic demo scenarios covering the full product surface
4. Be presentable in video/demo context via Presentation Mode
5. Never fabricate BIS data — abstention is a first-class outcome

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS variables for colour tokens
- **Components**: shadcn/ui (Radix UI primitives)
- **State**: React `useState` / `useContext` — no external state library
- **Animations**: CSS transitions + `setTimeout` chains for loading steps
- **Data**: Static TypeScript files in `/src/data/` — no database, no fetch calls

---

## Architecture

### Application Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout: DemoBanner + NavBar + Footer
│   ├── page.tsx                  # / → Home
│   ├── ask/
│   │   └── page.tsx              # /ask → Ask Sarathi
│   ├── industry/
│   │   └── page.tsx              # /industry → Industry Journey
│   ├── consumer/
│   │   └── page.tsx              # /consumer → Consumer Journey
│   ├── evidence/
│   │   └── page.tsx              # /evidence → Evidence Page
│   ├── how-it-works/
│   │   └── page.tsx              # /how-it-works → Pipeline Page
│   └── demo-data/
│       └── page.tsx              # /demo-data → Demo Data Transparency
├── components/
│   ├── layout/
│   │   ├── DemoBanner.tsx
│   │   ├── NavBar.tsx
│   │   └── Footer.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── QuickStartPrompts.tsx
│   │   ├── LoadingSequence.tsx
│   │   └── DemoScenarioSwitcher.tsx
│   ├── panels/
│   │   └── ServiceTracePanel.tsx
│   ├── cards/
│   │   ├── EvidenceCard.tsx
│   │   ├── ProductUnderstandingCard.tsx
│   │   ├── CandidateStandardCard.tsx
│   │   ├── LabCard.tsx
│   │   ├── VerificationResult.tsx
│   │   ├── ComplaintDraftCard.tsx
│   │   └── AbstentionResponse.tsx
│   ├── journey/
│   │   ├── IndustryJourney.tsx
│   │   ├── LabDiscovery.tsx
│   │   ├── ConsumerJourney.tsx
│   │   ├── ComplaintJourney.tsx
│   │   └── VerificationJourney.tsx
│   └── ui/
│       ├── SourceBadge.tsx
│       ├── FreshnessLabel.tsx
│       └── PresentationModeToggle.tsx
├── data/
│   ├── standards.ts
│   ├── labs.ts
│   ├── verification.ts
│   ├── responses.ts
│   └── evidence.ts
├── context/
│   └── AppContext.tsx
├── lib/
│   ├── promptRouter.ts
│   └── colours.ts
└── styles/
    └── globals.css
```

### Page Routing Table

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page, CTA, journey entry points |
| `/ask` | `AskSarathi` | Main chat interface with ServiceTracePanel |
| `/industry` | `IndustryJourney` | Guided 7-step industry workflow |
| `/consumer` | `ConsumerJourney` | Consumer plain-language journey |
| `/evidence` | `EvidencePage` | Searchable evidence record browser |
| `/how-it-works` | `HowItWorks` | Pipeline visual + outcome states |
| `/demo-data` | `DemoData` | Dataset provenance documentation |

### State Architecture

Global state is minimal — managed via a single `AppContext`:

```
AppContext {
  presentationMode: boolean
  setPresentationMode: (v: boolean) => void
}
```

All page-level state (active journey, chat history, loading state, filter values) lives in local `useState` within the relevant page or component. No prop-drilling beyond two levels — sub-components receive only what they need.

---

## Components and Interfaces

### Layout Components

#### `DemoBanner`
Persistent top strip on every page (rendered in root layout).
- Always visible, including in Presentation Mode
- Fixed text: "INTERACTIVE DEMO — Uses seeded/public-source demonstration records. Not connected to BIS production systems."
- Background: amber `#B45309`, white text, small caps
- Non-dismissable

#### `NavBar`
Top navigation bar rendered in root layout.
- Links: Home, Ask Sarathi, Industry, Consumer, Evidence, How It Works, Demo Data
- Active link detection via `usePathname()`
- Active item: deep navy underline + slightly bolder weight
- Right side: `PresentationModeToggle`
- In Presentation Mode: hides secondary nav items (Evidence, How It Works, Demo Data), keeps primary items

#### `Footer`
Static footer rendered in root layout.
- Line 1: "BIS Sarathi | SIH 2026 • PS 26107 • UDDAN"
- Line 2: "Interactive concept demonstrator using seeded/public-source demo records. Not connected to BIS production systems."
- External links (each `target="_blank" rel="noopener noreferrer"`): Official BIS, BIS Standards, BIS LIMS, BIS Care

### Chat Components

#### `ChatInterface`
The core chat UI on `/ask`. Manages the chat message list, input field, and loading sequence.

State:
```typescript
messages: ChatMessage[]
inputValue: string
isLoading: boolean
activeScenario: ScenarioId | null
serviceTrace: ServiceTrace | null
showServiceTrace: boolean
```

Behaviour:
- On submit: calls `resolvePrompt(input)` → gets `PromptResponse` → plays `LoadingSequence` → appends response message
- Quick-start buttons populate `inputValue` and auto-submit
- Scenario switcher selects a `ScenarioId` and triggers its associated prompt

#### `LoadingSequence`
Animated step display during simulated retrieval.

Steps (fixed order):
1. "Understanding request"
2. "Extracting product attributes"
3. "Searching BIS evidence"
4. "Checking revision/status"
5. "Preparing grounded response"

Each step appears with a 600ms delay via chained `setTimeout` calls. Label below: "Simulated demo retrieval". Steps use a checkmark animation — completed steps show a green tick, active step shows a spinner.

#### `QuickStartPrompts`
Six fixed prompt buttons. On click: sets input value, calls submit handler.

```typescript
const QUICK_PROMPTS: QuickPrompt[] = [
  { id: 'PROMPT_DRINKING_WATER', label: 'Which standard applies to packaged drinking water?' },
  { id: 'PROMPT_LABS',           label: 'Which labs can test against IS 14543?' },
  { id: 'PROMPT_WHAT_IS_14543',  label: 'What does IS 14543 cover?' },
  { id: 'PROMPT_COMPLAINT',      label: 'I want to complain about a product carrying an ISI mark.' },
  { id: 'PROMPT_VERIFY',         label: 'Can you verify this licence? DEMO-LIC-001' },
  { id: 'PROMPT_ABSTAIN',        label: 'Ask something outside the available evidence' },
]
```

#### `ServiceTracePanel`
Right-side collapsible panel. Receives a `ServiceTrace` object and renders it.

Fields displayed:
- INTENT
- QUERY TYPE
- ROUTE
- EVIDENCE SOURCES (count + source names)
- EVIDENCE STATUS
- NEXT ACTION

Never shows chain-of-thought. All values come from the seeded `ServiceTrace` object bundled with each `PromptResponse`. Panel can be toggled via a "Show Service Trace" button.

#### `DemoScenarioSwitcher`
Dropdown/tab control with six options: Industry, Lab, Consumer, Verification, Complaint, Trust Test. Selecting an option maps to a `PromptId` and triggers that scenario's full flow.

### Card Components

#### `EvidenceCard`
Displays a single evidence record.

Props: `EvidenceRecord`

Renders: source badge, standard/record ID, record type, retrieved date, authority, version/revision, "why used" text, official URL button.

Visual treatment: border-left 3px in source-type colour. OFFICIAL BIS = green left border, PUBLIC BIS LIMS = blue, DEMO/MOCK = amber, SYNTHETIC = grey.

#### `ProductUnderstandingCard`
Displays extracted product attributes.
Fields: Product, Category, Use. Simple two-column grid.

#### `CandidateStandardCard`
Displays a matched BIS standard.
Fields: standard number, title, version notes (e.g. "2024 record found", "Earlier 2016 record also found"), "Why surfaced" checklist.

#### `LabCard`
Displays a single lab record from the LIMS snapshot.
Fields: lab name, city, state, standard numbers, scope category, validity date, source URL link.
Always shows freshness label: "Public BIS LIMS snapshot — retrieved 28 Sep 2026"

#### `VerificationResult`
Displays verification outcome for a licence ID.
Always shows: "DEMO VERIFICATION RECORD" header, amber warning banner, status/source fields, explicit "Not connected to BIS production registry" notice. Never shows a green verified badge.

#### `ComplaintDraftCard`
Multi-step complaint preparation display.
Shows extracted fields with missing-field prompts, then the structured draft once fields are filled. Renders Edit / Review / Open official complaint channel buttons.

#### `AbstentionResponse`
Displays the "UNABLE TO VERIFY" outcome.
Purple-neutral colour treatment (`#7C3AED`), "UNABLE TO VERIFY" header, message: "I could not verify this reliably from the available BIS evidence. I will not guess.", "Why?" section with two reasons, "Open official BIS resource" CTA.

### UI Primitives

#### `SourceBadge`
Small badge component. Receives `SourceType` enum value, renders label and colour.

```typescript
type SourceType = 'OFFICIAL_BIS' | 'PUBLIC_BIS_LIMS' | 'DEMO' | 'MOCK' | 'SYNTHETIC'
```

Colours:
- OFFICIAL_BIS → green `#15803D`
- PUBLIC_BIS_LIMS → blue `#1D4ED8`
- DEMO / MOCK → amber `#B45309`
- SYNTHETIC → grey `#64748B`

#### `FreshnessLabel`
Small inline label: "retrieved {date}". Amber text for demo/mock records, grey for official snapshots.

#### `PresentationModeToggle`
Button in the NavBar. On click: toggles `presentationMode` in `AppContext`, adds/removes `presentation-mode` class on `document.body`.

---

## Data Models

All data models are TypeScript interfaces. All data is static — no runtime mutation, no persistence beyond React component state.

### Core Types

```typescript
// Prompt routing
type PromptId =
  | 'PROMPT_DRINKING_WATER'
  | 'PROMPT_LABS'
  | 'PROMPT_WHAT_IS_14543'
  | 'PROMPT_COMPLAINT'
  | 'PROMPT_VERIFY'
  | 'PROMPT_ABSTAIN'

type ScenarioId = 'INDUSTRY' | 'LAB' | 'CONSUMER' | 'VERIFICATION' | 'COMPLAINT' | 'TRUST_TEST'

type SourceType = 'OFFICIAL_BIS' | 'PUBLIC_BIS_LIMS' | 'DEMO' | 'MOCK' | 'SYNTHETIC'

type ResponseType = 'INDUSTRY' | 'LABS' | 'CONSUMER' | 'COMPLAINT' | 'VERIFICATION' | 'ABSTENTION'
```

### Standard Record

```typescript
interface BISStandard {
  id: string                    // e.g. "IS-14543-2024"
  standardNumber: string        // e.g. "IS 14543"
  title: string
  year: number
  supersedes?: string           // e.g. "IS-14543-2016"
  scope: string                 // plain-language scope description
  applicableProducts: string[]
  certificationScheme: string   // e.g. "CRS" | "Voluntary" | "Mandatory"
  sourceUrl: string             // official BIS URL
  sourceType: SourceType
  retrievedAt: string           // "28 Sep 2026"
  authority: string             // "BIS"
  revision: string
}
```

### Lab Record

```typescript
interface LabRecord {
  id: string
  labName: string
  city: string
  state: string
  standardNumbers: string[]     // standards in scope, e.g. ["IS 14543"]
  scopeCategory: string
  validityDate?: string         // may be absent in snapshot
  sourceUrl: string             // BIS LIMS page URL
  retrievedAt: string           // "28 Sep 2026"
  sourceType: SourceType        // always 'PUBLIC_BIS_LIMS'
  snapshotLabel: string         // "Public BIS LIMS snapshot — retrieved 28 Sep 2026"
}
```

### Verification Record

```typescript
interface VerificationRecord {
  licenceId: string             // e.g. "DEMO-LIC-001"
  status: string                // "Sample/Mock"
  productDescription: string
  manufacturer: string
  standard: string
  issuedDate: string
  expiryDate: string
  sourceType: SourceType        // always 'MOCK'
  isDemoRecord: true            // discriminant — never false
  warningText: string           // explicit disclaimer text
  retrievedAt: string
}
```

### Evidence Record

```typescript
interface EvidenceRecord {
  id: string
  source: string                // human-readable source name
  standardOrRecord: string      // identifier
  recordType: string            // "Standard" | "Lab Record" | "Verification Record" | etc.
  retrievedAt: string
  authority: string
  versionOrRevision: string
  whyUsed: string               // plain-language explanation
  officialUrl: string
  sourceType: SourceType
}
```

### Chat Message

```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  responseType?: ResponseType
  evidenceCards?: EvidenceRecord[]
  productUnderstanding?: ProductUnderstanding
  candidateStandards?: BISStandard[]
  labRecords?: LabRecord[]
  verificationResult?: VerificationRecord
  complaintDraft?: ComplaintDraft
  isAbstention?: boolean
  timestamp: number
}
```

### Prompt Response

```typescript
interface PromptResponse {
  promptId: PromptId
  responseType: ResponseType
  userMessage: string           // the display text of the triggering prompt
  assistantMessage: string      // main response text
  serviceTrace: ServiceTrace
  evidenceCards: EvidenceRecord[]
  productUnderstanding?: ProductUnderstanding
  candidateStandards?: BISStandard[]
  labRecords?: LabRecord[]
  verificationResult?: VerificationRecord
  complaintDraft?: ComplaintDraft
  isAbstention?: boolean
}
```

### Service Trace

```typescript
interface ServiceTrace {
  intent: string                // e.g. "Standards recommendation"
  queryType: string             // e.g. "Product → Standard"
  route: string                 // e.g. "Standards catalogue + version rules"
  evidenceSources: string[]     // e.g. ["BIS Standards catalogue", "BIS LIMS snapshot"]
  evidenceStatus: string        // e.g. "Supported by available evidence"
  nextAction: string            // e.g. "View official BIS record"
}
```

### Product Understanding

```typescript
interface ProductUnderstanding {
  product: string               // e.g. "Packaged Drinking Water"
  category: string              // e.g. "Drinking Water"
  use: string                   // e.g. "Packaged / Direct Consumption"
  matchReasons: string[]        // e.g. ["product-category match", "packaging/use match"]
}
```

### Complaint Draft

```typescript
interface ComplaintField {
  fieldName: string
  value: string | null          // null = missing, requires user action
  required: boolean
}

interface ComplaintDraft {
  fields: ComplaintField[]
  isComplete: boolean
  missingFieldCount: number
}
```

### Colour Tokens (CSS Variables)

Defined in `globals.css` and mirrored in `lib/colours.ts`:

```typescript
const colours = {
  primary:         '#1B2A4A',   // Deep navy — BIS blue
  accent:          '#FF671F',   // Saffron — Indian flag saffron
  background:      '#F8F9FA',   // Off-white
  surface:         '#FFFFFF',   // White
  border:          '#E2E8F0',
  textPrimary:     '#1A1A2E',
  textSecondary:   '#64748B',
  success:         '#15803D',   // Green — official records only
  warning:         '#B45309',   // Amber — demo/mock records
  abstain:         '#7C3AED',   // Purple-neutral — abstention (not error)
  bisLims:         '#1D4ED8',   // Blue — PUBLIC_BIS_LIMS badge
  synthetic:       '#64748B',   // Grey — SYNTHETIC badge
} as const
```

### Seeded Data — `/src/data/`

#### `standards.ts`
Two records for IS 14543:
- IS-14543-2024 (current revision)
- IS-14543-2016 (earlier revision, `supersedes` pointing to 2016)

Each record has full `BISStandard` shape. Scope text drawn from publicly available BIS descriptions — no fabricated clause numbers.

#### `labs.ts`
Four to five `LabRecord` objects representing BIS LIMS snapshot entries for labs with IS 14543 in scope. All carry `sourceType: 'PUBLIC_BIS_LIMS'` and `snapshotLabel: "Public BIS LIMS snapshot — retrieved 28 Sep 2026"`. Source URLs point to actual BIS LIMS pages.

#### `verification.ts`
One `VerificationRecord` with `licenceId: 'DEMO-LIC-001'`, `sourceType: 'MOCK'`, `isDemoRecord: true`. Includes explicit warning text. No green verified indicator used anywhere in rendering.

#### `responses.ts`
A `Record<PromptId, PromptResponse>` map. Six entries, one per prompt ID. Each entry is fully typed and self-contained — the complete `ChatMessage` payload the UI needs. No runtime string interpolation from external sources.

#### `evidence.ts`
Array of all `EvidenceRecord` objects used across all journeys. This is the canonical list rendered on the Evidence page. Includes entries for IS 14543 (both revisions), lab records, the mock verification record, and one synthetic test record.

---

## Demo Response System

The response system is a deterministic lookup table — no LLM, no fetch:

```typescript
// lib/promptRouter.ts

export function resolvePrompt(input: string): PromptId | null {
  const lower = input.toLowerCase()
  if (lower.includes('packaged drinking water') || lower.includes('drinking water standard'))
    return 'PROMPT_DRINKING_WATER'
  if (lower.includes('labs') || lower.includes('laboratories') || lower.includes('testing lab'))
    return 'PROMPT_LABS'
  if (lower.includes('is 14543') && (lower.includes('what') || lower.includes('mean') || lower.includes('cover')))
    return 'PROMPT_WHAT_IS_14543'
  if (lower.includes('complain') || lower.includes('isi mark') || lower.includes('complaint'))
    return 'PROMPT_COMPLAINT'
  if (lower.includes('verify') || lower.includes('licence') || lower.includes('demo-lic'))
    return 'PROMPT_VERIFY'
  return 'PROMPT_ABSTAIN'   // default — unknown query → abstention
}
```

When the returned `PromptId` is `null` or the input matches no seeded scenario, `PROMPT_ABSTAIN` fires. This means **any unknown query triggers abstention** — demonstrating the grounding gate to judges.

Quick-start buttons bypass `resolvePrompt` and directly pass their `PromptId`.

### Loading Sequence Implementation

```typescript
// In ChatInterface or LoadingSequence component

const STEPS = [
  'Understanding request',
  'Extracting product attributes',
  'Searching BIS evidence',
  'Checking revision/status',
  'Preparing grounded response',
]

function runLoadingSequence(onComplete: () => void) {
  let i = 0
  const advance = () => {
    if (i < STEPS.length) {
      setActiveStep(i)
      i++
      setTimeout(advance, 600)
    } else {
      onComplete()
    }
  }
  advance()
}
```

Total animation time: ~3 seconds. Matches the "Simulated demo retrieval" label.

---

## Routing Structure

Next.js App Router. All routes are static — no dynamic segments, no server-side data fetching, no `getServerSideProps`.

Root `layout.tsx` renders: `<DemoBanner />` → `<NavBar />` → `{children}` → `<Footer />`. The `AppContext` provider wraps the root layout so `presentationMode` is available application-wide.

Navigation uses Next.js `<Link>` for client-side routing (no full reload).

Active route detection: `usePathname()` from `next/navigation` compared against each nav item's `href`.

---

## State Management Approach

### Global State (`AppContext`)

```typescript
interface AppContextValue {
  presentationMode: boolean
  setPresentationMode: (v: boolean) => void
}
```

The `presentationMode` toggle also adds/removes `data-presentation="true"` on `<html>` (preferred over `body` class for SSR safety in Next.js). CSS selectors in `globals.css` then apply presentation-mode overrides:

```css
[data-presentation="true"] .nav-secondary { display: none; }
[data-presentation="true"] body { font-size: 1.125rem; }
[data-presentation="true"] .card { padding: 1.5rem; }
```

### Local State per Page/Component

- `ChatInterface`: messages array, loading state, input value, service trace visibility, active scenario
- `IndustryJourney`: current step index (0–6), whether lab discovery is active
- `ComplaintJourney`: current step (1–5), complaint fields map, missing field list
- `VerificationJourney`: input value, submitted licence ID, result visibility
- `EvidencePage`: search query string, active source-type filter
- `LabDiscovery`: state filter value

No cross-page state sharing needed beyond `presentationMode`.

---

## Animation Approach

All animations use CSS transitions (no animation library). Guidelines:

- **Loading steps**: `setTimeout` chain, 600ms per step, opacity + translateY fade-in for each new step
- **Card appearance**: `transition: opacity 200ms ease, transform 200ms ease` — cards fade in when they mount
- **Service Trace panel**: `transition: width 300ms ease` — slides in/out on toggle
- **Complaint steps**: Simple conditional rendering with opacity transition between step states
- **Hover states**: `transition: background-color 150ms ease` on interactive elements

No bounce, no parallax, no scroll-triggered animations. Subtle and professional.

---

## Accessibility Considerations

1. **Colour contrast**: All text combinations meet WCAG AA (4.5:1 minimum). The deep navy `#1B2A4A` on white exceeds AAA. Amber `#B45309` on white is used only for non-critical labels (badges), never as the sole content carrier.

2. **Focus management**: After a chat response loads, focus moves to the new response message using `ref.current?.focus()`. After quick-start prompt activation, focus moves to the input field.

3. **ARIA roles**: Chat message list uses `role="log" aria-live="polite"`. Loading sequence uses `role="status" aria-live="assertive"`. Service trace panel uses `aria-expanded` on the toggle button.

4. **Keyboard navigation**: All interactive elements (buttons, links, input) are natively keyboard accessible. `ServiceTracePanel` toggle is a `<button>`. Quick-start prompts are `<button>` elements.

5. **Screen reader text**: `SourceBadge` and `FreshnessLabel` include visually-hidden text via `sr-only` class. The demo banner is `role="banner"`.

6. **Motion**: Loading sequence respects `prefers-reduced-motion` — when set, all steps appear instantly without animation.

7. **Semantic HTML**: Evidence cards use `<article>`. Navigation uses `<nav>` with `aria-label`. Page main content uses `<main>`.

8. **External links**: All `target="_blank"` links include `aria-label` with "(opens in new tab)" and `rel="noopener noreferrer"`.

---

## Error Handling

This application has no network requests and no async data loading from external sources. "Error handling" therefore covers two concerns:

1. **Unknown prompts**: Any input that doesn't match a known prompt ID routes to `PROMPT_ABSTAIN`. The abstention response is always available in the seed data. The UI never reaches an empty/broken state.

2. **Missing data fields**: All optional fields in data models (`validityDate` on `LabRecord`, etc.) are typed as `string | undefined`. Components guard these with conditional rendering: `{lab.validityDate && <span>{lab.validityDate}</span>}`.

There are no loading spinners for data (data is synchronous), no error boundaries needed for data fetching, and no retry logic. The `LoadingSequence` is a deliberate simulation, not tied to actual async operations.


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Demo banner always present

*For any* page route rendered by the application, the root layout must include an element containing the exact text "INTERACTIVE DEMO — Uses seeded/public-source demonstration records. Not connected to BIS production systems."

**Validates: Requirements 1.1**

---

### Property 2: "Verified by BIS" never appears

*For any* component or page rendered by the application, the output must not contain the string "Verified by BIS" in any form.

This includes the verification result page, all chat responses, all cards, and all status labels. No rendered string may use this phrase.

**Validates: Requirements 1.2, 9.4**

---

### Property 3: Source badge present on all DEMO/MOCK/SYNTHETIC records

*For any* record object whose `sourceType` is `DEMO`, `MOCK`, or `SYNTHETIC`, when that record is rendered in the UI, a visible source badge element must be present carrying the corresponding label.

**Validates: Requirements 1.4, 11.3**

---

### Property 4: Freshness label invariant

*For any* seeded record that carries a `retrievedAt` field, when that record is rendered in any component, the displayed date must equal `"28 Sep 2026"`.

**Validates: Requirements 1.5, 6.3**

---

### Property 5: Quick-start prompts produce responses

*For any* quick-start prompt in the `QUICK_PROMPTS` array, activating that prompt must result in at least one assistant `ChatMessage` being appended to the message list with non-empty `content`.

**Validates: Requirements 4.2, 4.3**

---

### Property 6: Loading step sequence order invariant

*For any* query submission, the loading sequence must display all five steps — "Understanding request", "Extracting product attributes", "Searching BIS evidence", "Checking revision/status", "Preparing grounded response" — and must display them in exactly that order, with no steps omitted or reordered.

**Validates: Requirements 4.4, 5.2**

---

### Property 7: Service trace panel fields invariant

*For any* `ServiceTrace` object rendered in the `ServiceTracePanel`, all six fields — INTENT, QUERY TYPE, ROUTE, EVIDENCE SOURCES, EVIDENCE STATUS, NEXT ACTION — must be present as non-empty rendered elements.

**Validates: Requirements 4.6**

---

### Property 8: Service trace toggle round-trip

*For any* initial state of the `ServiceTracePanel`, toggling show then toggling hide must return the panel to the hidden state (the original `showServiceTrace: false` value). The toggle is idempotent over a full cycle.

**Validates: Requirements 4.7**

---

### Property 9: Unknown query always triggers abstention

*For any* text input that does not match the keyword patterns for any of the five non-abstention prompt IDs, the `resolvePrompt` function must return `PROMPT_ABSTAIN`, and the rendered response must be an abstention outcome displaying "UNABLE TO VERIFY."

**Validates: Requirements 4.8, 10.1, 10.2**

---

### Property 10: Lab record completeness invariant

*For any* `LabRecord` in the `labs` seed array, all required fields — `labName`, `city`, `state`, `standardNumbers`, `sourceUrl`, `retrievedAt` — must be non-empty strings (or non-empty arrays for `standardNumbers`).

**Validates: Requirements 6.4, 14.1**

---

### Property 11: Evidence page completeness

*For any* `EvidenceRecord` in the `evidence` seed array, a corresponding rendered `EvidenceCard` element must appear on the `/evidence` page when no filter is active.

**Validates: Requirements 11.1, 11.2**

---

### Property 12: No lorem ipsum in any rendered output

*For any* component rendered by the application, the visible text content must not contain the string "lorem ipsum" (case-insensitive) or any other common placeholder filler text pattern.

**Validates: Requirements 14.4, 15.4**

---

### Property 13: Presentation mode round-trip

*For any* initial layout state, activating presentation mode and then deactivating it must restore the layout to its original state — specifically, the `data-presentation` attribute on `<html>` must be absent after deactivation, and secondary navigation items must be visible again.

**Validates: Requirements 2.5, 2.6**

---

### Property 14: No "Submit to BIS" in complaint journey

*For any* step or state of the `ComplaintJourney` component, the rendered output must not contain the text "Submit to BIS" in any button label, heading, or body text.

**Validates: Requirements 8.7, 8.8**

---

## Error Handling

See the Error Handling section in the Architecture overview above. In summary:

- No network errors possible (no network requests)
- Unknown prompts gracefully degrade to abstention via `resolvePrompt` fallback
- All optional fields guarded with conditional rendering
- No error boundaries needed for data operations

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:

- **Unit tests** verify specific examples, exact text content, routing, and edge cases
- **Property tests** verify universal rules that must hold across all inputs and all records

Unit tests should be lean — they cover concrete behaviours that are specific and non-generalizable. Property tests cover everything that "must hold for all X."

### Tooling

- **Test runner**: Vitest (compatible with Next.js + TypeScript)
- **Component testing**: React Testing Library
- **Property-based testing**: `fast-check` (TypeScript-native, no setup overhead)
- Minimum **100 iterations per property test** (fast-check default is 100; do not reduce)

### Unit Tests — Focus Areas

1. `resolvePrompt` — specific keyword mapping for each of the 5 non-abstention scenarios
2. Root layout — presence of `DemoBanner`, `NavBar`, `Footer`
3. Home page — exact title, tagline, both CTA links, 4 capability card titles, journey entry points
4. NavBar — all 7 link destinations present
5. `ServiceTracePanel` — all 6 fields rendered for a known `ServiceTrace` fixture
6. `AbstentionResponse` — "UNABLE TO VERIFY" label, exact message, 2 reasons, CTA button
7. `VerificationResult` — warning banner present, "DEMO VERIFICATION RECORD" label, no green badge
8. `ComplaintDraftCard` — "Submit to BIS" absent at all steps
9. `EvidencePage` — filter input present, records render without active filter
10. `Footer` — required link hrefs and disclaimer text
11. `DemoData` page — three sections present with correct headings
12. `HowItWorks` page — all pipeline step labels, all 3 outcome state labels, required quote

### Property-Based Tests — Specification

Each property test is tagged with a comment referencing its design property.

**Tag format**: `// Feature: bis-sarathi, Property {N}: {property_text}`

```
Property 1: Demo banner always present
  Tag: // Feature: bis-sarathi, Property 1: demo banner always present on all pages
  Approach: For each route in the routes array, render the page in its root layout wrapper
            and assert the banner text is present. Routes are the generator input.
  Library: fast-check, fc.constantFrom(...routes)
  Iterations: 100

Property 2: "Verified by BIS" never appears
  Tag: // Feature: bis-sarathi, Property 2: "Verified by BIS" never appears in rendered output
  Approach: For each rendered component (EvidenceCard, VerificationResult, ChatMessage with each
            PromptResponse), render and assert the string is absent.
  Library: fast-check, fc.constantFrom(...allComponents)
  Iterations: 100

Property 3: Source badge on DEMO/MOCK/SYNTHETIC records
  Tag: // Feature: bis-sarathi, Property 3: source badge present on demo/mock/synthetic records
  Approach: Generate arbitrary EvidenceRecord objects with sourceType in {DEMO, MOCK, SYNTHETIC}.
            Render EvidenceCard and assert a badge element with the correct label is present.
  Library: fast-check, fc.record({ sourceType: fc.constantFrom('DEMO','MOCK','SYNTHETIC'), ... })
  Iterations: 100

Property 4: Freshness label invariant
  Tag: // Feature: bis-sarathi, Property 4: retrievedAt always displays "28 Sep 2026"
  Approach: For each record in all seed arrays (standards, labs, verification, evidence),
            render its card component and assert the date "28 Sep 2026" appears in the output.
  Library: fast-check, fc.constantFrom(...allRecords)
  Iterations: 100

Property 5: Quick-start prompts produce responses
  Tag: // Feature: bis-sarathi, Property 5: quick-start prompts produce non-empty responses
  Approach: For each promptId in QUICK_PROMPTS, call resolvePrompt with the prompt label text
            and assert the returned PromptResponse has non-empty assistantMessage.
  Library: fast-check, fc.constantFrom(...QUICK_PROMPTS)
  Iterations: 100

Property 6: Loading step sequence order invariant
  Tag: // Feature: bis-sarathi, Property 6: loading steps appear in correct order
  Approach: Assert that the LOADING_STEPS array equals the expected 5-element array in exact order.
            Then render LoadingSequence and check steps appear in DOM order.
  Library: fast-check (structural check on constant array)
  Iterations: 100

Property 7: Service trace panel fields invariant
  Tag: // Feature: bis-sarathi, Property 7: service trace panel renders all 6 required fields
  Approach: Generate arbitrary ServiceTrace objects with all 6 fields populated.
            Render ServiceTracePanel and assert all 6 field labels are present.
  Library: fast-check, fc.record({ intent: fc.string(), queryType: fc.string(), ... })
  Iterations: 100

Property 8: Service trace toggle round-trip
  Tag: // Feature: bis-sarathi, Property 8: service trace toggle show/hide round-trip
  Approach: Render ChatInterface, toggle show, toggle hide, assert panel is hidden again.
            Repeat with fc.boolean() to vary initial state.
  Library: fast-check
  Iterations: 100

Property 9: Unknown query always triggers abstention
  Tag: // Feature: bis-sarathi, Property 9: unknown queries always trigger abstention
  Approach: Generate arbitrary strings that do not contain any of the known keyword sets.
            Call resolvePrompt and assert result is PROMPT_ABSTAIN.
  Library: fast-check, fc.string() filtered to exclude known keywords
  Iterations: 100

Property 10: Lab record completeness invariant
  Tag: // Feature: bis-sarathi, Property 10: all lab records have required non-empty fields
  Approach: Import the labs seed array. For each record, assert all required fields are
            non-empty. Use fc.constantFrom(...labs) to iterate.
  Library: fast-check
  Iterations: 100

Property 11: Evidence page completeness
  Tag: // Feature: bis-sarathi, Property 11: every evidence record appears on the evidence page
  Approach: Import evidence seed array. Render EvidencePage with no active filter.
            For each record id, assert its standardOrRecord value appears in the rendered output.
  Library: fast-check, fc.constantFrom(...evidenceRecords)
  Iterations: 100

Property 12: No lorem ipsum in rendered output
  Tag: // Feature: bis-sarathi, Property 12: no lorem ipsum placeholder text in rendered output
  Approach: For each page/component, render it and assert the output does not match
            /lorem ipsum/i. Use fc.constantFrom(...allPages) as generator.
  Library: fast-check
  Iterations: 100

Property 13: Presentation mode round-trip
  Tag: // Feature: bis-sarathi, Property 13: presentation mode activate/deactivate round-trip
  Approach: Render NavBar with AppContext. Set presentationMode=true then false.
            Assert data-presentation attribute is absent and secondary nav items are visible.
  Library: fast-check (with fc.boolean() to vary intermediate steps)
  Iterations: 100

Property 14: No "Submit to BIS" in complaint journey
  Tag: // Feature: bis-sarathi, Property 14: "Submit to BIS" never appears in complaint journey
  Approach: Render ComplaintJourney at each step (0–4). For each step, assert the string
            "Submit to BIS" is absent from the rendered output.
  Library: fast-check, fc.integer({ min: 0, max: 4 })
  Iterations: 100
```

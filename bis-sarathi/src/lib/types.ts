// BIS Sarathi — Canonical TypeScript type definitions
// Single source of truth for all interfaces used across the application.
// All downstream files (data/, components/, app/) derive their types from here.
//
// Requirements: 15.5

// ─────────────────────────────────────────────────────────────────────────────
// Primitive union types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Source/provenance type for any evidence record in the dataset.
 *
 * - OFFICIAL_BIS     — public-source snapshot from bis.gov.in official catalogue
 * - PUBLIC_BIS_LIMS  — public-source snapshot from the BIS LIMS portal
 * - DEMO             — generic demo record (labelled; not connected to BIS systems)
 * - MOCK             — mock/sample record created solely for workflow demonstration
 * - SYNTHETIC        — artificially constructed test record; not a real BIS record
 */
export type SourceType =
  | 'OFFICIAL_BIS'
  | 'PUBLIC_BIS_LIMS'
  | 'DEMO'
  | 'MOCK'
  | 'SYNTHETIC'

/**
 * The six deterministic prompt IDs. Each maps 1-to-1 with a seeded
 * PromptResponse entry in `data/responses.ts`.
 */
export type PromptId =
  | 'PROMPT_DRINKING_WATER'
  | 'PROMPT_LABS'
  | 'PROMPT_WHAT_IS_14543'
  | 'PROMPT_COMPLAINT'
  | 'PROMPT_VERIFY'
  | 'PROMPT_ABSTAIN'

/**
 * Named demo scenarios shown in the DemoScenarioSwitcher.
 * Each scenario maps to a PromptId in the switcher component.
 */
export type ScenarioId =
  | 'INDUSTRY'
  | 'LAB'
  | 'CONSUMER'
  | 'VERIFICATION'
  | 'COMPLAINT'
  | 'TRUST_TEST'

/**
 * The response type discriminant on a PromptResponse / ChatMessage.
 * Used by MessageBubble to decide which card components to render.
 *
 * - STANDARDS_DISCOVERY  — standards recommendation (ProductUnderstanding + CandidateStandards)
 * - LAB_DISCOVERY        — laboratory list (LabRecords)
 * - CONSUMER_EXPLANATION — plain-language IS explanation (EvidenceCards only)
 * - COMPLAINT_DRAFT      — complaint preparation (ComplaintDraft + ComplaintFields)
 * - VERIFICATION_RESULT  — licence verification (VerificationSummary)
 * - ABSTENTION           — grounding gate refused; UNABLE TO VERIFY outcome
 */
export type ResponseType =
  | 'STANDARDS_DISCOVERY'
  | 'LAB_DISCOVERY'
  | 'CONSUMER_EXPLANATION'
  | 'COMPLAINT_DRAFT'
  | 'VERIFICATION_RESULT'
  | 'ABSTENTION'

// ─────────────────────────────────────────────────────────────────────────────
// Standards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A BIS standard record sourced from the official BIS catalogue.
 * Used in `data/standards.ts` and surfaced via `CandidateStandardCard`.
 */
export interface BISStandard {
  /** Unique record ID, e.g. "IS-14543-2024" */
  id: string
  /** Display standard number, e.g. "IS 14543" */
  standardNumber: string
  /** Full official title */
  title: string
  /** Publication year */
  year: number
  /** ID of the standard this revision supersedes, e.g. "IS-14543-2016" — absent on earliest revision */
  supersedes?: string
  /** Plain-language scope description drawn from public BIS sources */
  scope: string
  /** Product types this standard covers */
  applicableProducts: string[]
  /** Certification scheme applicable, e.g. "CRS" | "Voluntary" | "Mandatory" */
  certificationScheme: string
  /** Official BIS URL for this standard */
  sourceUrl: string
  /** Source/provenance type — always 'OFFICIAL_BIS' for standard records */
  sourceType: SourceType
  /** Snapshot retrieval date — must always be "28 Sep 2026" */
  retrievedAt: string
  /** Issuing authority — always "BIS" */
  authority: string
  /** Revision label, e.g. "2024 (4th Revision)" */
  revision: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Laboratories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A laboratory record from the public BIS LIMS snapshot.
 * Used in `data/labs.ts` and surfaced via `LabCard`.
 */
export interface LabRecord {
  /** Unique record ID, e.g. "LAB-CFL-DELHI" */
  id: string
  /** Official laboratory name */
  labName: string
  /** City where the lab is located */
  city: string
  /** State where the lab is located */
  state: string
  /** BIS standard numbers within the lab's accreditation scope, e.g. ["IS 14543"] */
  standardNumbers: string[]
  /** Scope/category description */
  scopeCategory: string
  /** Accreditation validity date — may be absent in the LIMS snapshot */
  validityDate?: string
  /** BIS LIMS page URL for this lab */
  sourceUrl: string
  /** Snapshot retrieval date — must always be "28 Sep 2026" */
  retrievedAt: string
  /** Source/provenance type — always 'PUBLIC_BIS_LIMS' for lab records */
  sourceType: SourceType
  /** Freshness label displayed on all lab cards, e.g. "Public BIS LIMS snapshot — retrieved 28 Sep 2026" */
  snapshotLabel: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Verification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A full verification record from `data/verification.ts`.
 * Used to power `VerificationResult` when detailed fields are needed.
 * Note: the PromptResponse carries a `VerificationSummary` (lighter-weight)
 * rather than the full record, to keep response payloads lean.
 */
export interface VerificationRecord {
  /** Licence identifier submitted by the user, e.g. "DEMO-LIC-001" */
  licenceId: string
  /** Status label, e.g. "Sample/Mock" */
  status: string
  /** Product the licence covers */
  productDescription: string
  /** Manufacturer name (demo/fictional for MOCK records) */
  manufacturer: string
  /** BIS standard number the licence is issued under */
  standard: string
  /** Licence issue date */
  issuedDate: string
  /** Licence expiry date */
  expiryDate: string
  /** Source/provenance type — always 'MOCK' for demo verification records */
  sourceType: SourceType
  /**
   * Discriminant field — always `true` for demo records.
   * Ensures VerificationResult component can never accidentally render without
   * the mandatory DEMO disclaimer.
   */
  isDemoRecord: true
  /** Explicit disclaimer text rendered in the amber warning banner */
  warningText: string
  /** Snapshot retrieval date — must always be "28 Sep 2026" */
  retrievedAt: string
}

/**
 * Lightweight verification summary carried inside `PromptResponse`.
 * Contains only the fields needed to render the verification outcome in chat.
 * The full `VerificationRecord` lives in `data/verification.ts` and is
 * referenced by the `VerificationJourney` component directly.
 */
export interface VerificationSummary {
  /** Licence identifier, e.g. "DEMO-LIC-001" */
  licenceId: string
  /** Status label, e.g. "Sample/Mock" */
  status: string
  /** Mandatory disclaimer text for the amber warning banner */
  warningText: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Evidence records
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single evidence record in the canonical dataset (`data/evidence.ts`).
 * Rendered as `EvidenceCard` on the Evidence page and inline in chat responses.
 */
export interface EvidenceRecord {
  /** Unique record ID, e.g. "EVD-STD-IS14543-2024" */
  id: string
  /** Human-readable source name, e.g. "BIS Official Standards Catalogue (bis.gov.in)" */
  source: string
  /** Standard or record identifier displayed on the card, e.g. "IS 14543:2024" */
  standardOrRecord: string
  /** Record type label, e.g. "Standard" | "Lab Record" | "Verification Record" | "Synthetic Test Record" */
  recordType: string
  /** Snapshot retrieval date — must always be "28 Sep 2026" */
  retrievedAt: string
  /** Issuing authority, e.g. "BIS" or "N/A — Demo record only" */
  authority: string
  /** Version or revision label, e.g. "2024 (4th Revision)" */
  versionOrRevision: string
  /** Plain-language explanation of why this record is included in the dataset */
  whyUsed: string
  /** Official URL for this record — opens in a new tab from EvidenceCard */
  officialUrl: string
  /** Source/provenance type — drives visual treatment (border colour, badge) */
  sourceType: SourceType
}

// ─────────────────────────────────────────────────────────────────────────────
// Service trace
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Safe pipeline metadata shown in the `ServiceTracePanel`.
 * Contains only system-visible metadata — never chain-of-thought or
 * internal reasoning steps.
 */
export interface ServiceTrace {
  /** High-level intent label, e.g. "Standards recommendation for a product" */
  intent: string
  /** Query classification, e.g. "Product → Standard" */
  queryType: string
  /** Retrieval route description, e.g. "BIS Standards catalogue + version/revision rules" */
  route: string
  /** List of evidence sources consulted, e.g. ["BIS Standards Catalogue (bis.gov.in)"] */
  evidenceSources: string[]
  /** Evidence quality assessment, e.g. "Supported by available evidence" */
  evidenceStatus: string
  /** Recommended next action for the user, e.g. "View official BIS record for IS 14543" */
  nextAction: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Product understanding
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracted product attributes displayed in `ProductUnderstandingCard`.
 * Populated in the STANDARDS_DISCOVERY response type.
 */
export interface ProductUnderstanding {
  /** Extracted product name, e.g. "Packaged Drinking Water" */
  product: string
  /** Extracted product category, e.g. "Packaged Food / Beverages" */
  category: string
  /** Extracted use context, e.g. "Direct human consumption" */
  use: string
  /** Reasons this product was matched to the candidate standard */
  matchReasons: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Candidate standard
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A BIS standard surfaced as a candidate match in a STANDARDS_DISCOVERY response.
 * Rendered by `CandidateStandardCard`.
 * Lighter-weight than `BISStandard` — carries only display-relevant fields plus
 * match rationale.
 */
export interface CandidateStandard {
  /** Standard record ID, e.g. "IS-14543-2024" — used to cross-reference `data/standards.ts` */
  standardId: string
  /** Display standard number, e.g. "IS 14543" */
  standardNumber: string
  /** Full official title */
  title: string
  /** Publication year */
  year: number
  /** Version/revision notes shown on the card, e.g. "2024 record found — current revision" */
  versionNotes: string
  /** Reasons this standard was surfaced for the user's query */
  matchReasons: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Complaint preparation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single field in the complaint draft, displayed in `ComplaintDraftCard`.
 * Fields with `isMissing: true` are highlighted with action buttons prompting
 * the user to supply the missing information.
 */
export interface ComplaintField {
  /** Display label for the field, e.g. "Licence / ISI mark number" */
  label: string
  /** Extracted or user-supplied value — `undefined` when the field is missing */
  value?: string
  /** Whether this required field is absent and must be supplied before drafting */
  isMissing: boolean
}

/**
 * Structured complaint draft payload used in a COMPLAINT_DRAFT response.
 * Tracks extracted field values, missing fields, and the composed draft text.
 */
export interface ComplaintDraft {
  /** Extracted product description */
  product?: string
  /** Extracted licence or ISI mark number */
  licenceOrMarkNumber?: string
  /** Extracted purchase context (where/when) */
  purchaseDetails?: string
  /** Extracted issue description */
  issueDescription?: string
  /** Names of fields that are still missing and must be provided by the user */
  missingFields: string[]
  /** Composed draft text — absent until all required fields are provided */
  draftText?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt response
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A fully-resolved response entry from the deterministic lookup table in
 * `data/responses.ts`. One entry per PromptId. The ChatInterface reads this
 * payload to populate a ChatMessage and drive card rendering.
 *
 * Evidence cards and lab records are stored as string IDs (not inline objects)
 * so that the canonical records in `data/evidence.ts` and `data/labs.ts`
 * remain the single source of truth. Components resolve IDs at render time.
 */
export interface PromptResponse {
  /** The PromptId this response belongs to */
  promptId: PromptId
  /** Response type — drives which card components MessageBubble renders */
  responseType: ResponseType
  /** Main assistant message text shown in the chat bubble */
  assistantMessage: string
  /** Extracted product attributes — present for STANDARDS_DISCOVERY */
  productUnderstanding?: ProductUnderstanding
  /** Matched candidate standards — present for STANDARDS_DISCOVERY */
  candidateStandards?: CandidateStandard[]
  /** Lab record IDs to resolve from `data/labs.ts` — present for LAB_DISCOVERY */
  labRecords?: string[]
  /** Verification summary — present for VERIFICATION_RESULT */
  verificationResult?: VerificationSummary
  /** Complaint draft payload — present for COMPLAINT_DRAFT */
  complaintDraft?: ComplaintDraft
  /** Flat list of complaint fields for display — present for COMPLAINT_DRAFT */
  complaintFields?: ComplaintField[]
  /** Evidence record IDs to resolve from `data/evidence.ts` */
  evidenceCards?: string[]
  /** Pipeline metadata for the ServiceTracePanel */
  serviceTrace: ServiceTrace
  /** Whether this is an abstention (grounding gate refusal) outcome */
  isAbstention?: boolean
  /** Abstention message — mirrors assistantMessage for abstention responses */
  abstentionMessage?: string
  /** Two stated reasons for abstention — shown in the "Why?" section */
  abstentionReasons?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat message
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single message in the ChatInterface conversation history.
 * Stored in the `messages` state array of `ChatInterface`.
 */
export interface ChatMessage {
  /** Unique message ID (UUID or incrementing string) */
  id: string
  /** Who sent the message */
  role: 'user' | 'assistant'
  /** Display text content of the message */
  content: string
  /**
   * Full PromptResponse payload — present on assistant messages only.
   * Drives inline card rendering inside `MessageBubble`.
   */
  promptResponse?: PromptResponse
  /** Unix timestamp (ms) when the message was created */
  timestamp: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick-start prompt
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A clickable quick-start prompt button in `QuickStartPrompts`.
 * Activating a button populates the input with `prompt` and auto-submits.
 */
export interface QuickPrompt {
  /** PromptId this button maps to */
  id: PromptId
  /** Short display label shown on the button */
  label: string
  /** Full text sent as the user message on activation */
  prompt: string
}

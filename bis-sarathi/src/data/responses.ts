// BIS Sarathi — Deterministic prompt response lookup table
// No LLM, no fetch. Every response is seeded, typed, and self-contained.
//
// Each entry in the map is a fully-resolved PromptResponse — the complete payload
// the ChatInterface needs to render an assistant message, including evidence cards,
// service trace metadata, and any typed sub-payloads (labs, verification, complaint, etc.).
//
// Requirements: 4.2, 14.2, 14.3

import type {
  PromptId,
  PromptResponse,
  CandidateStandard,
  ProductUnderstanding,
  ComplaintDraft,
  ServiceTrace,
  VerificationSummary,
} from '../lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT_DRINKING_WATER
// ─────────────────────────────────────────────────────────────────────────────

const drinkingWaterProductUnderstanding: ProductUnderstanding = {
  product: 'Packaged Drinking Water',
  category: 'Packaged Food / Beverages',
  use: 'Direct human consumption',
  matchReasons: [
    'Product-category match: "packaged drinking water" maps directly to the BIS WRD category',
    'Packaging/use match: sealed containers for direct consumption',
    'Mandatory certification flag: CRS applies to this product category',
  ],
}

const drinkingWaterCandidates: CandidateStandard[] = [
  {
    standardId: 'IS-14543-2024',
    standardNumber: 'IS 14543',
    title: 'Packaged Drinking Water (other than Packaged Natural Mineral Water)',
    year: 2024,
    versionNotes:
      '2024 record found — current in-force revision (4th Revision). ' +
      'Mandatory under the Compulsory Registration Scheme (CRS). ' +
      'Supersedes the 2016 (3rd Revision) edition.',
    matchReasons: [
      'Exact product-category match: IS 14543 covers packaged drinking water for direct consumption',
      'Current revision: 2024 edition is the in-force standard',
      'Certification scheme match: CRS applies — ISI mark required for sale in India',
    ],
  },
  {
    standardId: 'IS-14543-2016',
    standardNumber: 'IS 14543',
    title: 'Packaged Drinking Water (other than Packaged Natural Mineral Water)',
    year: 2016,
    versionNotes:
      'Earlier 2016 record also found (3rd Revision) — superseded by 2024 edition. ' +
      'Products tested under the 2016 edition may require re-testing against the 2024 revision. ' +
      'Included for version-awareness in certification lifecycle queries.',
    matchReasons: [
      'Same product category as IS 14543:2024 — prior revision, now superseded',
      'Surfaced to demonstrate version-awareness for manufacturers with existing certification under 2016 edition',
    ],
  },
]

const drinkingWaterServiceTrace: ServiceTrace = {
  intent: 'Standards recommendation for a product',
  queryType: 'Product → Standard',
  route: 'BIS Standards catalogue + version/revision rules',
  evidenceSources: [
    'BIS Standards Catalogue (bis.gov.in)',
    'BIS version/revision status index',
  ],
  evidenceStatus: 'Supported by available evidence',
  nextAction: 'View official BIS record for IS 14543',
  confidenceScore: 92,
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT_LABS
// ─────────────────────────────────────────────────────────────────────────────

const labsServiceTrace: ServiceTrace = {
  intent: 'Laboratory discovery for a specific standard',
  queryType: 'Standard → Accredited Labs',
  route: 'BIS LIMS snapshot lookup → lab records for IS 14543',
  evidenceSources: [
    'BIS Laboratory Information Management System (BIS LIMS)',
    'Public BIS LIMS snapshot — 28 Sep 2026',
  ],
  evidenceStatus: 'Supported by public BIS LIMS snapshot',
  nextAction: 'Verify current laboratory status on BIS LIMS before booking',
  confidenceScore: 85,
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT_WHAT_IS_14543
// ─────────────────────────────────────────────────────────────────────────────

const whatIs14543ServiceTrace: ServiceTrace = {
  intent: 'Consumer plain-language explanation of a standard',
  queryType: 'Standard ID → Plain-language explanation',
  route: 'BIS Standards catalogue — scope lookup for IS 14543',
  evidenceSources: ['BIS Standards Catalogue (bis.gov.in)'],
  evidenceStatus: 'Supported by available evidence',
  nextAction: 'View official BIS record for IS 14543',
  confidenceScore: 88,
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT_COMPLAINT
// ─────────────────────────────────────────────────────────────────────────────

const complaintDraft: ComplaintDraft = {
  product: 'Packaged drinking water (brand/size not yet provided)',
  licenceOrMarkNumber: undefined,      // missing — user must supply
  purchaseDetails: undefined,          // missing — user must supply
  issueDescription: 'Product carrying an ISI mark — specific defect or non-compliance not yet described',
  missingFields: ['licenceOrMarkNumber', 'purchaseDetails'],
  draftText: undefined,                // unavailable until all required fields are provided
}

const complaintServiceTrace: ServiceTrace = {
  intent: 'Consumer complaint preparation for an ISI-marked product',
  queryType: 'Complaint intent → Structured complaint draft',
  route: 'Complaint field extraction → missing-field detection → draft preparation',
  evidenceSources: ['BIS Care complaint guidance (bis.gov.in/bis-care)'],
  evidenceStatus: 'Fields partially extracted — 2 required fields missing',
  nextAction: 'Open official BIS Care complaint channel to submit',
  confidenceScore: 71,
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT_VERIFY
// ─────────────────────────────────────────────────────────────────────────────

const verificationSummary: VerificationSummary = {
  licenceId: 'DEMO-LIC-001',
  status: 'Sample/Mock',
  warningText:
    'THIS IS A MOCK DEMONSTRATION RECORD ONLY. ' +
    'It does not represent a real BIS licence, a real manufacturer, or a real product. ' +
    'This record is not sourced from, and is not connected to, the BIS production licence registry or any official BIS system. ' +
    'Do not use this information for any compliance, legal, or purchasing decision. ' +
    'To verify a real ISI licence, visit the official BIS portal at https://www.bis.gov.in.',
}

const verificationServiceTrace: ServiceTrace = {
  intent: 'Licence/ISI mark verification',
  queryType: 'Licence ID → Verification record lookup',
  route: 'Demo verification record lookup (not BIS production registry)',
  evidenceSources: ['Demo Verification Record (Mock — not BIS production)'],
  evidenceStatus: 'Mock/demo record only — not verified against BIS production systems',
  nextAction: 'Visit official BIS portal to verify a real licence',
  confidenceScore: 55,
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT_ABSTAIN
// ─────────────────────────────────────────────────────────────────────────────

const abstentionServiceTrace: ServiceTrace = {
  intent: 'Query outside available evidence scope',
  queryType: 'Unknown / out-of-scope query',
  route: 'Grounding gate — no matching evidence found',
  evidenceSources: [],
  evidenceStatus: 'No supporting evidence available',
  nextAction: 'Visit official BIS portal for authoritative information',
  confidenceScore: 0,
}

// ─────────────────────────────────────────────────────────────────────────────
// Responses map — Record<PromptId, PromptResponse>
// ─────────────────────────────────────────────────────────────────────────────

export const responses: Record<PromptId, PromptResponse> = {

  // ── Standards discovery: packaged drinking water ──────────────────────────
  PROMPT_DRINKING_WATER: {
    promptId: 'PROMPT_DRINKING_WATER',
    responseType: 'STANDARDS_DISCOVERY',
    assistantMessage:
      'Based on the available BIS evidence, the applicable standard for packaged drinking water is IS 14543 — ' +
      'Packaged Drinking Water (other than Packaged Natural Mineral Water). ' +
      'The current in-force revision is IS 14543:2024 (4th Revision), which supersedes the 2016 edition. ' +
      'Certification is mandatory under the Compulsory Registration Scheme (CRS) — products must carry the ISI mark before sale in India.',
    productUnderstanding: drinkingWaterProductUnderstanding,
    candidateStandards: drinkingWaterCandidates,
    evidenceCards: [
      'EVD-STD-IS14543-2024',
      'EVD-STD-IS14543-2016',
    ],
    serviceTrace: drinkingWaterServiceTrace,
  },

  // ── Lab discovery: testing labs for IS 14543 ─────────────────────────────
  PROMPT_LABS: {
    promptId: 'PROMPT_LABS',
    responseType: 'LAB_DISCOVERY',
    assistantMessage:
      'Based on the public BIS LIMS snapshot (retrieved 28 Sep 2026), the following laboratories ' +
      'are listed with IS 14543 (Packaged Drinking Water) in their testing scope. ' +
      'Please verify current laboratory status directly on the BIS LIMS portal before booking or sending samples — ' +
      'accreditation status and validity dates may have changed since this snapshot.',
    labRecords: [
      'LAB-CFL-DELHI',
      'LAB-NEERI-NAGPUR',
      'LAB-TWAD-CHENNAI',
      'LAB-UPJN-LUCKNOW',
      'LAB-IICT-HYDERABAD',
    ],
    evidenceCards: [
      'EVD-LAB-CFL-DELHI',
      'EVD-LAB-NEERI-NAGPUR',
      'EVD-LAB-TWAD-CHENNAI',
      'EVD-LAB-UPJN-LUCKNOW',
      'EVD-LAB-IICT-HYDERABAD',
    ],
    serviceTrace: labsServiceTrace,
  },

  // ── Consumer explanation: what is IS 14543? ───────────────────────────────
  PROMPT_WHAT_IS_14543: {
    promptId: 'PROMPT_WHAT_IS_14543',
    responseType: 'CONSUMER_EXPLANATION',
    assistantMessage:
      'IS 14543 is the Bureau of Indian Standards (BIS) specification for packaged drinking water — ' +
      'specifically water that has been treated and sealed in bottles, jars, or pouches for direct consumption. ' +
      'It covers physical and chemical quality requirements (such as pH, dissolved solids, and heavy metal limits), ' +
      'microbiological requirements (ensuring the water is safe from bacteria and pathogens), ' +
      'and packaging and labelling requirements (what information must appear on the container). ' +
      'The current version is IS 14543:2024 (4th Revision). ' +
      'Any packaged drinking water sold in India must carry the ISI mark under this standard — ' +
      'this means the product has been certified by BIS as meeting these quality and safety requirements.',
    evidenceCards: [
      'EVD-STD-IS14543-2024',
      'EVD-STD-IS14543-2016',
    ],
    serviceTrace: whatIs14543ServiceTrace,
  },

  // ── Complaint draft: ISI mark complaint ───────────────────────────────────
  PROMPT_COMPLAINT: {
    promptId: 'PROMPT_COMPLAINT',
    responseType: 'COMPLAINT_DRAFT',
    assistantMessage:
      'I can help you prepare a structured complaint about a product carrying an ISI mark. ' +
      'I have extracted what I can from your query, but I need a few more details to complete the draft. ' +
      'Please note: I prepare the draft for your review — you confirm and submit through the official BIS Care channel.',
    complaintDraft: complaintDraft,
    complaintFields: [
      {
        label: 'Product description',
        value: 'Packaged drinking water (brand/size not yet provided)',
        isMissing: false,
      },
      {
        label: 'Licence / ISI mark number',
        value: undefined,
        isMissing: true,
      },
      {
        label: 'Purchase details (where/when purchased)',
        value: undefined,
        isMissing: true,
      },
      {
        label: 'Issue description',
        value: 'Product carries an ISI mark — specific defect or non-compliance not yet described',
        isMissing: false,
      },
    ],
    evidenceCards: [],
    serviceTrace: complaintServiceTrace,
  },

  // ── Licence verification: DEMO-LIC-001 ────────────────────────────────────
  PROMPT_VERIFY: {
    promptId: 'PROMPT_VERIFY',
    responseType: 'VERIFICATION_RESULT',
    assistantMessage:
      'I have located a demonstration record for licence ID DEMO-LIC-001. ' +
      'This is a mock/sample record created for demo purposes only — ' +
      'it is not connected to the BIS production licence registry and does not represent a real BIS certification. ' +
      'The record is shown below with all mandatory demo disclaimers.',
    verificationResult: verificationSummary,
    evidenceCards: ['EVD-MOCK-DEMO-LIC-001'],
    serviceTrace: verificationServiceTrace,
  },

  // ── Abstention: unknown / out-of-scope query ──────────────────────────────
  PROMPT_ABSTAIN: {
    promptId: 'PROMPT_ABSTAIN',
    responseType: 'ABSTENTION',
    assistantMessage:
      'I could not verify this reliably from the available BIS evidence. I will not guess.',
    isAbstention: true,
    abstentionMessage:
      'I could not verify this reliably from the available BIS evidence. I will not guess.',
    abstentionReasons: [
      'No authoritative evidence found in the available BIS dataset for this query.',
      'Insufficient current regulatory data to provide a grounded response.',
    ],
    evidenceCards: [],
    serviceTrace: abstentionServiceTrace,
  },
}

export default responses

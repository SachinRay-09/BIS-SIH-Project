// BIS Sarathi — Deterministic prompt router
// Resolves a free-text user input to one of six PromptIds via keyword matching.
// No LLM inference. No runtime fetch. Pure string matching against known keyword sets.
//
// Requirements: 4.2 (quick-start prompts), 4.3 (prompt activation), 10.1 (abstention fallback)

import type { PromptId, QuickPrompt } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Quick-start prompts
// Six canonical demo scenarios. Labels and prompts are the canonical values
// used by QuickStartPrompts component buttons and DemoScenarioSwitcher.
// ─────────────────────────────────────────────────────────────────────────────

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'PROMPT_DRINKING_WATER',
    label: 'Which standard applies to packaged drinking water?',
    prompt: 'Which standard applies to packaged drinking water?',
  },
  {
    id: 'PROMPT_LABS',
    label: 'Which labs can test against IS 14543?',
    prompt: 'Which labs can test against IS 14543?',
  },
  {
    id: 'PROMPT_WHAT_IS_14543',
    label: 'What does IS 14543 cover?',
    prompt: 'What does IS 14543 cover?',
  },
  {
    id: 'PROMPT_COMPLAINT',
    label: 'I want to complain about a product carrying an ISI mark.',
    prompt: 'I want to complain about a product carrying an ISI mark.',
  },
  {
    id: 'PROMPT_VERIFY',
    label: 'Can you verify this licence? DEMO-LIC-001',
    prompt: 'Can you verify this licence? DEMO-LIC-001',
  },
  {
    id: 'PROMPT_ABSTAIN',
    label: 'Ask something outside the available evidence',
    prompt: 'Ask something outside the available evidence',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Keyword sets per PromptId
// Checked in priority order — more specific patterns first.
// All matching is case-insensitive (input is lowercased before comparison).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PROMPT_WHAT_IS_14543 must be checked BEFORE PROMPT_DRINKING_WATER because
 * phrases like "what is IS 14543" contain "14543" but express an explanation
 * intent, not a manufacturing/certification intent.
 * It must also be checked BEFORE PROMPT_LABS because "what does IS 14543 cover"
 * would otherwise match the standalone "14543" in a labs question.
 */
const WHAT_IS_14543_KEYWORDS = [
  'what is is 14543',
  'what is is14543',
  'explain is 14543',
  'explain is14543',
  'is 14543 means',
  'is14543 means',
  'what does is 14543',
  'what does is14543',
  'is 14543 cover',
  'is14543 cover',
  'is 14543 mean',
  'is14543 mean',
  'tell me about is 14543',
  'tell me about is14543',
  'describe is 14543',
  'describe is14543',
  'simple terms',   // "in simple terms" — pairs well with 14543 context
]

/**
 * PROMPT_DRINKING_WATER — manufacturing/certification intent for packaged water.
 * Checked after WHAT_IS_14543 to avoid hijacking explanation queries.
 */
const DRINKING_WATER_KEYWORDS = [
  'packaged drinking water',
  'packaged water',
  'bottled water',
  'water bottle',
  'drinking water standard',
  'drinking water certification',
  'drinking water bis',
  'drinking water isi',
  'drinking water manufacture',
  'drinking water make',
  'make packaged',
  'manufacture packaged',
  'manufacture water',
  'produce water',
  'sell water',
  'water business',
  'water product',
  'water certification',
  'water standard',
  'water isi',
  'is 14543',   // standalone standard reference → likely a water/certification query
  'is14543',
]

/**
 * PROMPT_LABS — laboratory and testing discovery.
 * Checked after WHAT_IS_14543 and DRINKING_WATER.
 */
const LABS_KEYWORDS = [
  'lab',
  'laboratory',
  'laboratories',
  'testing lab',
  'test lab',
  'lims',
  'bis lims',
  'recognised lab',
  'recognized lab',
  'accredited lab',
  'testing facility',
  'test facility',
  'where can i test',
  'where to test',
  'who can test',
]

/**
 * PROMPT_COMPLAINT — consumer complaint preparation.
 */
const COMPLAINT_KEYWORDS = [
  'complain',
  'complaint',
  'bad smell',
  'smells bad',
  'defective',
  'defect',
  'faulty',
  'fault',
  'quality issue',
  'quality problem',
  'isi mark problem',
  'isi mark issue',
  'bad product',
  'poor quality',
  'bad quality',
  'bad taste',
  'tastes bad',
  'unsafe',
  'contaminated',
  'not safe',
  'not clean',
  'file a complaint',
  'raise a complaint',
  'lodge a complaint',
  'how do i complain',
  'how to complain',
  'consumer grievance',
  'grievance',
  'report a product',
  'report product',
]

/**
 * PROMPT_VERIFY — licence and ISI mark verification.
 */
const VERIFY_KEYWORDS = [
  'verify',
  'verification',
  'licence',
  'license',
  'demo-lic',
  'demo lic',
  'lic-001',
  'isi mark check',
  'check isi',
  'check licence',
  'check license',
  'is this isi',
  'is this genuine',
  'is this real',
  'authentic',
  'authenticity',
  'validate licence',
  'validate license',
  'check mark',
]

// ─────────────────────────────────────────────────────────────────────────────
// resolvePrompt
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps a free-text user input to a `PromptId` using deterministic keyword matching.
 *
 * Matching rules:
 * 1. Input is lowercased for all comparisons.
 * 2. More specific / explanation-intent patterns (WHAT_IS_14543) are checked first.
 * 3. If no keyword set matches, returns `'PROMPT_ABSTAIN'` — the grounding fallback.
 *
 * @param input - Raw user input string.
 * @returns The resolved `PromptId`.
 */
export function resolvePrompt(input: string): PromptId {
  const lower = input.toLowerCase()

  // 1 — Explanation intent: "What is IS 14543 / explain IS 14543 / in simple terms"
  //     Must be first to prevent "is 14543" from matching DRINKING_WATER.
  if (WHAT_IS_14543_KEYWORDS.some((kw) => lower.includes(kw))) {
    return 'PROMPT_WHAT_IS_14543'
  }

  // 2 — Verification intent: checked before complaint to avoid "licence" matching complaint path
  if (VERIFY_KEYWORDS.some((kw) => lower.includes(kw))) {
    return 'PROMPT_VERIFY'
  }

  // 3 — Complaint intent
  if (COMPLAINT_KEYWORDS.some((kw) => lower.includes(kw))) {
    return 'PROMPT_COMPLAINT'
  }

  // 4 — Lab / testing discovery
  if (LABS_KEYWORDS.some((kw) => lower.includes(kw))) {
    return 'PROMPT_LABS'
  }

  // 5 — Standards / certification for packaged drinking water
  if (DRINKING_WATER_KEYWORDS.some((kw) => lower.includes(kw))) {
    return 'PROMPT_DRINKING_WATER'
  }

  // 6 — Grounding gate fallback: insufficient evidence → abstention
  return 'PROMPT_ABSTAIN'
}

// BIS Sarathi — /how-it-works page
// Server component — no client state required.
//
// Explains the five-step processing pipeline, the six possible outcomes,
// and the grounding gate / abstention principle.
//
// Requirements: 13.1, 13.2, 13.3, 13.4, 13.5

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — BIS Sarathi',
  description:
    'Understand the BIS Sarathi evidence pipeline: from query to grounded response.',
}

// ── Pipeline steps ─────────────────────────────────────────────────────────
// Labels must match LOADING_STEPS exactly (see LoadingSequence.tsx).
const PIPELINE_STEPS = [
  {
    label: 'Query Received',
    description:
      "The user's input is accepted and prepared for processing. The text is normalised and passed to the intent layer.",
    icon: '📥',
  },
  {
    label: 'Intent Classification',
    description:
      'Keywords are matched to one of six prompt IDs using deterministic rules. No LLM inference at this step — the mapping is a fixed lookup.',
    icon: '🔍',
  },
  {
    label: 'Evidence Retrieval',
    description:
      'Relevant records are retrieved from the seeded BIS dataset. Only records present in the seed files are considered — nothing is generated from model weights.',
    icon: '📂',
  },
  {
    label: 'Grounding Gate',
    description:
      'The system verifies evidence quality before proceeding. If the evidence is insufficient, the pipeline fails gracefully to abstention rather than fabricating an answer.',
    icon: '🛡️',
  },
  {
    label: 'Response Synthesis',
    description:
      'The matched response is assembled with evidence cards, a service trace, and a structured payload. Every field in the response is sourced from the seeded dataset.',
    icon: '✅',
  },
] as const

// ── Outcome states ─────────────────────────────────────────────────────────
const OUTCOMES = [
  {
    label: 'Standards Discovery',
    tier: 'HIGH / SUPPORTED',
    tierColour: '#15803D',
    description:
      'The system identified a matching BIS standard with supporting evidence. A candidate standard card and evidence records are returned.',
  },
  {
    label: 'Lab Discovery',
    tier: 'HIGH / SUPPORTED',
    tierColour: '#15803D',
    description:
      'Accredited testing laboratories from the public BIS LIMS snapshot are surfaced for the identified standard.',
  },
  {
    label: 'Consumer Explanation',
    tier: 'HIGH / SUPPORTED',
    tierColour: '#15803D',
    description:
      'A plain-language explanation of the relevant BIS standard is provided, sourced directly from the seeded dataset.',
  },
  {
    label: 'Complaint Draft',
    tier: 'MEDIUM / NEEDS CLARIFICATION',
    tierColour: '#B45309',
    description:
      'A structured complaint template is prepared with extracted fields. Missing fields are identified for the user to supply before the official submission step.',
  },
  {
    label: 'Verification Result',
    tier: 'MEDIUM / NEEDS CLARIFICATION',
    tierColour: '#B45309',
    description:
      'A demo verification record is displayed with full transparency labelling. The result explicitly states it is not connected to the BIS production registry.',
  },
  {
    label: 'Abstention',
    tier: 'LOW / UNABLE TO VERIFY',
    tierColour: '#7C3AED',
    description:
      "The grounding gate determined that available evidence was insufficient. The system responds with \"UNABLE TO VERIFY\" and routes to the official BIS resource. It will not guess.",
  },
] as const

// ── High-level architecture pipeline ───────────────────────────────────────
// Labels from Requirement 13.1
const ARCH_STAGES = [
  'USER',
  'LANGUAGE + INTENT',
  'QUERY PLANNER',
  'STRUCTURED LOOKUP / HYBRID RETRIEVAL',
  'EVIDENCE VALIDATION',
  'GROUNDING GATE',
  'ANSWER / CLARIFY / ABSTAIN',
  'NEXT OFFICIAL ACTION',
] as const

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-16">
      {/* ── Page header ── */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-3">
          System Architecture
        </p>
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">
          How It Works
        </h1>
        <p className="text-[#64748B] max-w-2xl">
          BIS Sarathi uses a deterministic, evidence-first pipeline. Every
          response is grounded in seeded BIS records — no live inference, no
          fabrication.
        </p>
      </header>

      {/* ── Architecture overview ── */}
      <section aria-labelledby="arch-heading">
        <h2
          id="arch-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-6"
        >
          Architecture Overview
        </h2>

        {/* Arrow pipeline — horizontal scroll on small screens */}
        <div
          role="list"
          aria-label="System architecture pipeline"
          className="flex flex-wrap items-center gap-2"
        >
          {ARCH_STAGES.map((stage, idx) => (
            <div key={stage} role="listitem" className="flex items-center gap-2">
              <span className="rounded border border-[#E2E8F0] bg-[#F8F9FA] px-3 py-1.5 text-xs font-medium text-[#1B2A4A] whitespace-nowrap">
                {stage}
              </span>
              {idx < ARCH_STAGES.length - 1 && (
                <span
                  className="text-[#64748B] text-sm select-none"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Required quote — Requirement 13.4 */}
        <blockquote className="mt-6 border-l-4 border-[#1B2A4A] pl-4">
          <p className="text-sm italic text-[#1B2A4A] font-medium">
            "The model explains the evidence. BIS evidence decides."
          </p>
        </blockquote>
      </section>

      {/* ── Five-step pipeline detail ── */}
      <section aria-labelledby="pipeline-heading">
        <h2
          id="pipeline-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-6"
        >
          Five-Step Processing Pipeline
        </h2>

        <ol className="space-y-4" aria-label="Processing pipeline steps">
          {PIPELINE_STEPS.map((step, idx) => (
            <li
              key={step.label}
              className="flex gap-4 rounded-lg border border-[#E2E8F0] bg-white p-5"
            >
              {/* Step number */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B2A4A] text-white text-xs font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span aria-hidden="true">{step.icon}</span>
                  <h3 className="text-sm font-semibold text-[#1B2A4A]">
                    {step.label}
                  </h3>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Grounding gate / abstention principle ── */}
      <section
        aria-labelledby="grounding-heading"
        className="rounded-lg border border-[#7C3AED] bg-[#FAF5FF] p-6"
      >
        <h2
          id="grounding-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED] mb-3"
        >
          The Grounding Gate
        </h2>
        <p className="text-sm text-[#1A1A2E] mb-4 leading-relaxed">
          Before synthesising a response, the system evaluates whether the
          retrieved evidence is sufficient to support an answer. If it is not,
          the pipeline routes to abstention — a first-class outcome, not an
          error state.
        </p>
        <p className="text-sm text-[#1A1A2E] mb-4 leading-relaxed">
          This is the core trustworthiness mechanism of BIS Sarathi. A system
          that knows what it does not know is more useful than one that invents
          answers.
        </p>
        {/* Required quote — must appear verbatim for unit test 13.12 */}
        <blockquote className="border-l-4 border-[#7C3AED] pl-4">
          <p className="text-sm font-semibold italic text-[#7C3AED]">
            "I will not guess."
          </p>
        </blockquote>
      </section>

      {/* ── Six outcome states ── */}
      <section aria-labelledby="outcomes-heading">
        <h2
          id="outcomes-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-6"
        >
          Six Possible Outcomes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OUTCOMES.map((outcome) => (
            <article
              key={outcome.label}
              className="rounded-lg border border-[#E2E8F0] bg-white p-5"
            >
              {/* Tier badge */}
              <span
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2"
                style={{
                  color: outcome.tierColour,
                  backgroundColor: `${outcome.tierColour}18`,
                  border: `1px solid ${outcome.tierColour}40`,
                }}
              >
                {outcome.tier}
              </span>

              {/* Outcome label */}
              <h3 className="text-sm font-bold text-[#1B2A4A] mb-2">
                {outcome.label}
              </h3>

              <p className="text-xs text-[#64748B] leading-relaxed">
                {outcome.description}
              </p>
            </article>
          ))}
        </div>

        {/* Three-state summary table — Requirement 13.3 */}
        <div className="mt-8 rounded-lg border border-[#E2E8F0] overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Outcome states and their descriptions
            </caption>
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#64748B]"
                >
                  Evidence Level
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#64748B]"
                >
                  State
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#64748B]"
                >
                  System Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr>
                <td className="px-4 py-3 font-semibold text-[#15803D]">HIGH</td>
                <td className="px-4 py-3 text-[#1A1A2E]">SUPPORTED</td>
                <td className="px-4 py-3 text-[#64748B]">
                  Answer with evidence
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-[#B45309]">
                  MEDIUM
                </td>
                <td className="px-4 py-3 text-[#1A1A2E]">
                  NEEDS CLARIFICATION
                </td>
                <td className="px-4 py-3 text-[#64748B]">
                  Ask for additional information
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-[#7C3AED]">LOW</td>
                <td className="px-4 py-3 text-[#1A1A2E]">UNABLE TO VERIFY</td>
                <td className="px-4 py-3 text-[#64748B]">
                  Abstain and route to official source
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Transparency notice ── */}
      <section
        aria-labelledby="transparency-heading"
        className="rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] p-6"
      >
        <h2
          id="transparency-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-3"
        >
          Transparency Principles
        </h2>
        <ul className="space-y-2 text-sm text-[#64748B]">
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">
              →
            </span>
            Every response is derived exclusively from the seeded TypeScript
            data files — no runtime LLM calls, no external API requests.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">
              →
            </span>
            All records carry a source badge and a freshness label (retrieved 28
            Sep 2026) so the provenance of every piece of information is
            visible.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">
              →
            </span>
            The Service Trace panel exposes safe pipeline metadata (intent,
            route, evidence status) — never chain-of-thought or internal
            reasoning.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">
              →
            </span>
            This is an interactive concept demonstrator. It is not connected to
            any BIS production system.
          </li>
        </ul>
      </section>
    </div>
  )
}

// BIS Sarathi — /how-it-works page
// E.1: Full two-column architecture diagram (SIH v2 § 5.1)
// E.2: "The LLM explains. BIS evidence decides." headline
// E.3: Source hierarchy / Data Tier section (SIH v2 § 6.1)
// Preserves all required quotes and labels for unit tests 13.1, 13.3, 13.4, 13.12
// Requirements: 13.1, 13.2, 13.3, 13.4, 13.5

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — BIS Sarathi',
  description:
    'Understand the BIS Sarathi evidence pipeline: from query to grounded response.',
}

// ── Pipeline steps (required for unit test 13.12) ──────────────────────────
const PIPELINE_STEPS = [
  {
    label: 'Query Received',
    description: "The user's input is accepted and prepared for processing. The text is normalised and passed to the intent layer.",
    icon: '📥',
  },
  {
    label: 'Intent Classification',
    description: 'Keywords are matched to one of six prompt IDs using deterministic rules. No LLM inference at this step — the mapping is a fixed lookup.',
    icon: '🔍',
  },
  {
    label: 'Evidence Retrieval',
    description: 'Relevant records are retrieved from the seeded BIS dataset. Only records present in the seed files are considered — nothing is generated from model weights.',
    icon: '📂',
  },
  {
    label: 'Grounding Gate',
    description: 'The system verifies evidence quality before proceeding. If the evidence is insufficient, the pipeline fails gracefully to abstention rather than fabricating an answer.',
    icon: '🛡️',
  },
  {
    label: 'Response Synthesis',
    description: 'The matched response is assembled with evidence cards, a service trace, and a structured payload. Every field in the response is sourced from the seeded dataset.',
    icon: '✅',
  },
] as const

// ── Outcome states ─────────────────────────────────────────────────────────
const OUTCOMES = [
  { label: 'Standards Discovery',  tier: 'HIGH / SUPPORTED',            tierColour: '#15803D', description: 'The system identified a matching BIS standard with supporting evidence. A candidate standard card and evidence records are returned.' },
  { label: 'Lab Discovery',        tier: 'HIGH / SUPPORTED',            tierColour: '#15803D', description: 'Accredited testing laboratories from the public BIS LIMS snapshot are surfaced for the identified standard.' },
  { label: 'Consumer Explanation', tier: 'HIGH / SUPPORTED',            tierColour: '#15803D', description: 'A plain-language explanation of the relevant BIS standard is provided, sourced directly from the seeded dataset.' },
  { label: 'Complaint Draft',      tier: 'MEDIUM / NEEDS CLARIFICATION',tierColour: '#B45309', description: 'A structured complaint template is prepared with extracted fields. Missing fields are identified for the user to supply before the official submission step.' },
  { label: 'Verification Result',  tier: 'MEDIUM / NEEDS CLARIFICATION',tierColour: '#B45309', description: 'A demo verification record is displayed with full transparency labelling. The result explicitly states it is not connected to the BIS production registry.' },
  { label: 'Abstention',           tier: 'LOW / UNABLE TO VERIFY',      tierColour: '#7C3AED', description: 'The grounding gate determined that available evidence was insufficient. The system responds with "UNABLE TO VERIFY" and routes to the official BIS resource. It will not guess.' },
] as const

// ── Architecture pipeline (required for unit test 13.1) ───────────────────
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

// ── E.1 Full architecture layers (SIH v2 § 5.1) ───────────────────────────
const ARCH_LAYERS = [
  {
    label: 'User Channels',
    detail: 'Web app / mobile web / approved channel',
    color: '#1B2A4A',
  },
  {
    label: 'Language + Query Understanding',
    detail: 'Language detection · translation · intent · entity extraction (product, IS number, HUID, licence, location, issue type)',
    color: '#1D4ED8',
  },
  {
    label: 'Deterministic Query Planner',
    detail: 'Exact identifier → direct lookup · Product description → standards recommender · Lab request → BIS LIMS · Knowledge question → hybrid retrieval · Complaint → structured workflow',
    color: '#1D4ED8',
  },
  {
    label: 'Hybrid Knowledge Engine + Structured Service Connectors',
    detail: 'BM25 / lexical search · dense retrieval · metadata filtering · Standards catalogue adapter · BIS LIMS adapter · Verification adapter · Complaint workflow',
    color: '#15803D',
    wide: true,
  },
  {
    label: 'Evidence Validation Layer',
    detail: 'Source authority · entity match · version · freshness · conflict · evidence coverage · applicability rules · ambiguity detection',
    color: '#B45309',
  },
  {
    label: 'Grounding Gate — Confidence Scoring',
    detail: 'HIGH → answer · MEDIUM → answer with qualification / ask clarification · LOW → abstain + official verification route',
    color: '#7C3AED',
  },
  {
    label: 'Response Layer',
    detail: 'Explanation · evidence cards · status · confidence score · next action — LLM used only for explanation / summarisation, not as authority',
    color: '#1B2A4A',
  },
  {
    label: 'Audit + Feedback Loop',
    detail: 'Query logs · redacted failures · KB gaps · source freshness · human review queue · evaluation reports',
    color: '#64748B',
  },
] as const

// ── E.3 Source hierarchy / Data Tiers (SIH v2 § 6.1) ─────────────────────
const DATA_TIERS = [
  {
    tier: 'Tier A',
    label: 'Public authoritative BIS sources',
    color: '#15803D',
    bg: '#F0FDF4',
    border: '#86EFAC',
    examples: ['BIS Standards portal / public catalogue', 'BIS Care information and service content', 'BIS LIMS public laboratory directory', 'Official BIS notices and publications'],
    usedInDemo: true,
  },
  {
    tier: 'Tier B',
    label: 'Authorized BIS data',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    border: '#93C5FD',
    examples: ['Licensed standards text / corpus', 'Authorized internal BIS APIs', 'Authorized service registries', 'Approved e-BIS / BIS Care integrations'],
    usedInDemo: false,
    productionNote: 'Used in production; not available in this demo.',
  },
  {
    tier: 'Tier C',
    label: 'Supporting external sources',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FDE68A',
    examples: ['Permitted external reference material', 'Clearly labelled third-party sources'],
    usedInDemo: false,
    productionNote: 'Only when permitted and clearly labelled.',
  },
  {
    tier: 'Tier D',
    label: 'Synthetic / demo data',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#CBD5E1',
    examples: ['Mock verification records', 'Synthetic test records for pipeline validation', 'Demo interaction flow data'],
    usedInDemo: true,
    warning: 'Never presented as authoritative BIS information.',
  },
] as const

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-16">

      {/* ── Page header ── */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-3">
          System Architecture
        </p>
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3">How It Works</h1>
        <p className="text-[#64748B] max-w-2xl">
          BIS Sarathi uses a deterministic, evidence-first pipeline. Every response is grounded in seeded BIS records — no live inference, no fabrication.
        </p>
      </header>

      {/* ── E.2 Key positioning headline ── */}
      <section aria-labelledby="positioning-heading">
        <div className="rounded-lg border border-[#1B2A4A] bg-[#F8F9FA] p-6">
          <h2 id="positioning-heading" className="text-xs font-semibold uppercase tracking-widest text-[#64748B] mb-3">
            Core architectural principle
          </h2>
          {/* E.2 — required headline (SIH v2 § 5.2) */}
          <blockquote className="border-l-4 border-[#1B2A4A] pl-4 mb-3">
            <p className="text-lg font-bold text-[#1B2A4A]">
              "The LLM explains. BIS evidence decides."
            </p>
          </blockquote>
          <p className="text-sm text-[#64748B] leading-relaxed">
            The language model in BIS Sarathi is an explanation engine, not an authority engine. It structures and summarises — but it is never allowed to manufacture an IS number, a licence status, a laboratory recognition status, or a certification requirement. All of those come from evidence retrieved from authoritative BIS sources.
          </p>
          {/* Required quote for unit test 13.4 */}
          <blockquote className="mt-4 border-l-4 border-[#64748B] pl-4">
            <p className="text-sm italic text-[#1B2A4A] font-medium">
              "The model explains the evidence. BIS evidence decides."
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── E.1 Full architecture diagram (SIH v2 § 5.1) ── */}
      <section aria-labelledby="arch-full-heading">
        <h2 id="arch-full-heading" className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-6">
          Full System Architecture
        </h2>

        {/* Linear architecture — horizontal arrow pipeline (required for unit test 13.1) */}
        <div role="list" aria-label="System architecture pipeline" className="flex flex-wrap items-center gap-2 mb-8">
          {ARCH_STAGES.map((stage, idx) => (
            <div key={stage} role="listitem" className="flex items-center gap-2">
              <span className="rounded border border-[#E2E8F0] bg-[#F8F9FA] px-3 py-1.5 text-xs font-medium text-[#1B2A4A] whitespace-nowrap">
                {stage}
              </span>
              {idx < ARCH_STAGES.length - 1 && (
                <span className="text-[#64748B] text-sm select-none" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>

        {/* Detailed layer stack */}
        <div className="flex flex-col gap-2" aria-label="Detailed architecture layers">
          {ARCH_LAYERS.map((layer) => (
            <div
              key={layer.label}
              style={{ borderLeftColor: layer.color }}
              className="rounded-md border border-[#E2E8F0] border-l-4 bg-white px-4 py-3"
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: layer.color }}>
                {layer.label}
              </p>
              <p className="text-xs text-[#64748B] leading-relaxed">{layer.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Five-step pipeline detail ── */}
      <section aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-6">
          Five-Step Processing Pipeline
        </h2>
        <ol className="space-y-4" aria-label="Processing pipeline steps">
          {PIPELINE_STEPS.map((step, idx) => (
            <li key={step.label} className="flex gap-4 rounded-lg border border-[#E2E8F0] bg-white p-5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B2A4A] text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span aria-hidden="true">{step.icon}</span>
                  <h3 className="text-sm font-semibold text-[#1B2A4A]">{step.label}</h3>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Grounding gate ── */}
      <section aria-labelledby="grounding-heading" className="rounded-lg border border-[#7C3AED] bg-[#FAF5FF] p-6">
        <h2 id="grounding-heading" className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED] mb-3">
          The Grounding Gate
        </h2>
        <p className="text-sm text-[#1A1A2E] mb-4 leading-relaxed">
          Before synthesising a response, the system evaluates whether the retrieved evidence is sufficient to support an answer. If it is not, the pipeline routes to abstention — a first-class outcome, not an error state.
        </p>
        <p className="text-sm text-[#1A1A2E] mb-4 leading-relaxed">
          This is the core trustworthiness mechanism of BIS Sarathi. A system that knows what it does not know is more useful than one that invents answers.
        </p>
        {/* Required quote verbatim for unit test 13.12 */}
        <blockquote className="border-l-4 border-[#7C3AED] pl-4">
          <p className="text-sm font-semibold italic text-[#7C3AED]">"I will not guess."</p>
        </blockquote>
      </section>

      {/* ── Six outcome states ── */}
      <section aria-labelledby="outcomes-heading">
        <h2 id="outcomes-heading" className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-6">
          Six Possible Outcomes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OUTCOMES.map((outcome) => (
            <article key={outcome.label} className="rounded-lg border border-[#E2E8F0] bg-white p-5">
              <span
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2"
                style={{ color: outcome.tierColour, backgroundColor: `${outcome.tierColour}18`, border: `1px solid ${outcome.tierColour}40` }}
              >
                {outcome.tier}
              </span>
              <h3 className="text-sm font-bold text-[#1B2A4A] mb-2">{outcome.label}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{outcome.description}</p>
            </article>
          ))}
        </div>

        {/* Three-state table — required for unit test 13.3 */}
        <div className="mt-8 rounded-lg border border-[#E2E8F0] overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">Outcome states and their descriptions</caption>
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#64748B]">Evidence Level</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#64748B]">State</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#64748B]">System Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr>
                <td className="px-4 py-3 font-semibold text-[#15803D]">HIGH</td>
                <td className="px-4 py-3 text-[#1A1A2E]">SUPPORTED</td>
                <td className="px-4 py-3 text-[#64748B]">Answer with evidence</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-[#B45309]">MEDIUM</td>
                <td className="px-4 py-3 text-[#1A1A2E]">NEEDS CLARIFICATION</td>
                <td className="px-4 py-3 text-[#64748B]">Ask for additional information</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-[#7C3AED]">LOW</td>
                <td className="px-4 py-3 text-[#1A1A2E]">UNABLE TO VERIFY</td>
                <td className="px-4 py-3 text-[#64748B]">Abstain and route to official source</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── E.3 Source Hierarchy / Data Tier section ── */}
      <section aria-labelledby="data-tier-heading">
        <h2 id="data-tier-heading" className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-2">
          Source Hierarchy — Data Tiers
        </h2>
        <p className="text-sm text-[#64748B] mb-6">
          BIS Sarathi explicitly classifies all information sources into four tiers. Every response shows which tier its evidence comes from.
        </p>
        <div className="flex flex-col gap-3">
          {DATA_TIERS.map((tier) => (
            <div
              key={tier.tier}
              style={{ borderLeftColor: tier.color, backgroundColor: tier.bg, borderColor: tier.border }}
              className="rounded-md border border-l-4 px-5 py-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: tier.color }}>
                  {tier.tier}
                </span>
                <span className="text-sm font-semibold text-[#1B2A4A]">{tier.label}</span>
                {tier.usedInDemo && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white border" style={{ color: tier.color, borderColor: tier.color }}>
                    Used in this demo
                  </span>
                )}
                {!tier.usedInDemo && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[#94A3B8]">
                    Production only
                  </span>
                )}
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-0.5 mb-1">
                {tier.examples.map((ex) => (
                  <li key={ex} className="text-xs text-[#64748B]">· {ex}</li>
                ))}
              </ul>
              {'warning' in tier && tier.warning && (
                <p className="text-xs font-semibold mt-1" style={{ color: tier.color }}>{tier.warning}</p>
              )}
              {'productionNote' in tier && tier.productionNote && (
                <p className="text-xs text-[#94A3B8] mt-1">{tier.productionNote}</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#94A3B8]">
          Tier B and Tier C sources would be used in the production version with authorized BIS integrations. This demo uses only Tier A public snapshots and Tier D demo/synthetic records.
        </p>
      </section>

      {/* ── Transparency notice ── */}
      <section aria-labelledby="transparency-heading" className="rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] p-6">
        <h2 id="transparency-heading" className="text-sm font-semibold uppercase tracking-widest text-[#64748B] mb-3">
          Transparency Principles
        </h2>
        <ul className="space-y-2 text-sm text-[#64748B]">
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">→</span>
            Every response is derived exclusively from the seeded TypeScript data files — no runtime LLM calls, no external API requests.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">→</span>
            All records carry a source badge and a freshness label (retrieved 28 Sep 2026) so the provenance of every piece of information is visible.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">→</span>
            The Service Trace panel exposes safe pipeline metadata (intent, route, evidence status) — never chain-of-thought or internal reasoning.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[#1B2A4A] font-bold">→</span>
            This is an interactive concept demonstrator. It is not connected to any BIS production system.
          </li>
        </ul>
      </section>

    </div>
  )
}

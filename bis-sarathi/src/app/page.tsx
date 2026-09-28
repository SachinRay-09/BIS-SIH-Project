// BIS Sarathi — Home page
// Government-technology aesthetic: structured action tiles, no gradients.
// C.1: Four action tiles matching SIH v2 § 30 Recommended Product UI.
// C.2: "Try a live demo" strip with three pre-wired scenarios.
// Requirements: 3.1–3.8

import Link from 'next/link'
import { HomeProductInput } from '@/components/HomeProductInput'

// ── Action tiles (C.1) ──────────────────────────────────────────────────────
const ACTION_TILES = [
  {
    icon: '📋',
    label: 'Find my standard',
    description: 'Product description → candidate BIS standard → certification route',
    href: '/industry',
    cta: 'Start →',
  },
  {
    icon: '🏛️',
    label: 'Understand certification',
    description: 'CRS, ISI mark, mandatory vs voluntary — what applies to your product',
    href: '/industry',
    cta: 'Explore →',
  },
  {
    icon: '🔬',
    label: 'Find a testing laboratory',
    description: 'BIS LIMS snapshot — recognised labs for IS 14543 (packaged drinking water)',
    href: '/industry',
    cta: 'Find labs →',
  },
  {
    icon: '💬',
    label: 'Ask about BIS',
    description: 'Natural-language queries about standards, marks, complaints, and verification',
    href: '/ask',
    cta: 'Ask now →',
  },
] as const

// ── Live demo scenarios (C.2) ───────────────────────────────────────────────
const DEMO_SCENARIOS = [
  {
    label: 'Industry: Find standard',
    href: '/ask?q=Which+standard+applies+to+packaged+drinking+water%3F',
    color: '#1B2A4A',
  },
  {
    label: 'Consumer: Understand IS 14543',
    href: '/ask?q=What+does+IS+14543+cover%3F',
    color: '#15803D',
  },
  {
    label: 'Trust test: Out of scope',
    href: '/ask?q=Ask+something+outside+the+available+evidence',
    color: '#7C3AED',
  },
] as const

// ── Capability summary cards ────────────────────────────────────────────────
const CAPABILITY_CARDS = [
  {
    title: 'Standards Discovery',
    description: 'Find the right BIS standard for your product — IS 14543 and beyond',
    href: '/industry',
    icon: '📋',
  },
  {
    title: 'Lab Finder',
    description: 'Discover accredited testing labs from the public BIS LIMS snapshot',
    href: '/industry',
    icon: '🔬',
  },
  {
    title: 'Consumer Guidance',
    description: 'Understand what BIS marks mean and how to protect your rights',
    href: '/consumer',
    icon: '🛡️',
  },
  {
    title: 'Licence Verification',
    description: 'Check demonstration ISI licence records with full transparency',
    href: '/ask',
    icon: '✅',
  },
] as const

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-14 pb-10 border-b border-[#E2E8F0]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-5">
          Demo mode&nbsp;•&nbsp;Seeded/public-source records&nbsp;•&nbsp;No production BIS connection
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] tracking-tight mb-3">
          BIS Sarathi
        </h1>
        <p className="text-base text-[#64748B] max-w-xl mb-2">
          Ask naturally. Verify with BIS evidence. Act through the official BIS service.
        </p>
        <p className="text-sm text-[#64748B] max-w-lg mb-8">
          An evidence-first conversational service layer for BIS standards, certification, labs, and consumer workflows.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <Link
            href="/ask"
            className="inline-flex items-center justify-center rounded-md bg-[#1B2A4A] text-white text-sm font-medium px-6 py-3 transition-colors hover:bg-[#243561] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
          >
            Ask Sarathi →
          </Link>
          <Link
            href="/evidence"
            className="inline-flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#1B2A4A] text-sm font-medium px-6 py-3 transition-colors hover:bg-[#F8F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
          >
            View Evidence →
          </Link>
        </div>

        {/* C.1 — Product description quick-start */}
        <div className="w-full max-w-xl">
          <p className="text-xs text-[#94A3B8] mb-2 text-center">Describe your product to find the right standard:</p>
          <HomeProductInput />
        </div>

        {/* Required tagline for tests */}
        <p className="sr-only">
          AI-assisted navigation for BIS standards, labs, and consumer protection — SIH 2026.
        </p>
      </section>

      {/* ── C.1 — Four action tiles ───────────────────────────────────────── */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#64748B] text-center mb-6">
          What are you trying to do?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTION_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group flex flex-col gap-3 rounded-lg border border-[#E2E8F0] bg-white p-5 transition-colors hover:border-[#1B2A4A] hover:bg-[#F8F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
            >
              <span className="text-2xl" role="presentation" aria-hidden="true">{tile.icon}</span>
              <span className="text-sm font-semibold text-[#1B2A4A] group-hover:underline">{tile.label}</span>
              <span className="text-xs text-[#64748B] leading-relaxed flex-1">{tile.description}</span>
              <span className="text-xs font-medium text-[#FF671F]">{tile.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── C.2 — Try a live demo strip ───────────────────────────────────── */}
      <section className="border-t border-[#E2E8F0] bg-[#F8F9FA] px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#64748B] text-center mb-5">
            Try a live demo scenario
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {DEMO_SCENARIOS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                style={{ borderColor: s.color, color: s.color }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium bg-white hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {s.label} →
              </Link>
            ))}
          </div>
          <p className="text-center text-xs text-[#94A3B8] mt-4">
            Scenarios use seeded BIS data — no backend required
          </p>
        </div>
      </section>

      {/* ── Capability summary cards ──────────────────────────────────────── */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#64748B] text-center mb-6">
          What Sarathi can help with
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAPABILITY_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col gap-3 rounded-lg border border-[#E2E8F0] bg-white p-5 transition-colors hover:border-[#1B2A4A] hover:bg-[#F8F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
            >
              <span className="text-2xl" role="presentation" aria-hidden="true">{card.icon}</span>
              <span className="text-sm font-semibold text-[#1B2A4A] group-hover:underline">{card.title}</span>
              <span className="text-xs text-[#64748B] leading-relaxed">{card.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Journey entry points ──────────────────────────────────────────── */}
      <section className="border-t border-[#E2E8F0] bg-[#F8F9FA] px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-2">Choose your journey</h2>
          <p className="text-sm text-[#64748B] mb-8">Different entry points for industry users and consumers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/industry"
              className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] bg-white p-6 text-left transition-colors hover:border-[#1B2A4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
            >
              <span className="text-xl" role="presentation" aria-hidden="true">🏭</span>
              <span className="text-sm font-semibold text-[#1B2A4A]">Industry / MSME</span>
              <span className="text-xs text-[#64748B] leading-relaxed">
                Identify the right standard, understand certification obligations, and discover testing labs for your product.
              </span>
              <span className="mt-2 text-xs font-medium text-[#FF671F]">Start industry journey →</span>
            </Link>
            <Link
              href="/consumer"
              className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] bg-white p-6 text-left transition-colors hover:border-[#1B2A4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
            >
              <span className="text-xl" role="presentation" aria-hidden="true">🛒</span>
              <span className="text-sm font-semibold text-[#1B2A4A]">Consumer</span>
              <span className="text-xs text-[#64748B] leading-relaxed">
                Understand BIS marks, verify product safety, and prepare a structured complaint if you suspect a marking violation.
              </span>
              <span className="mt-2 text-xs font-medium text-[#FF671F]">Start consumer journey →</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

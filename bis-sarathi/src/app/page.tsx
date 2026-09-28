import Link from 'next/link'

// Static capability card data — descriptions drawn from seeded domain knowledge
const CAPABILITY_CARDS = [
  {
    title: 'Standards Discovery',
    description:
      'Find the right BIS standard for your product — IS 14543 and beyond',
    href: '/industry',
    icon: '📋',
  },
  {
    title: 'Lab Finder',
    description:
      'Discover accredited testing labs from the public BIS LIMS snapshot',
    href: '/industry',
    icon: '🔬',
  },
  {
    title: 'Consumer Guidance',
    description:
      'Understand what BIS marks mean and how to protect your rights',
    href: '/consumer',
    icon: '🛡️',
  },
  {
    title: 'Licence Verification',
    description:
      'Check demonstration ISI licence records with full transparency',
    href: '/ask',
    icon: '✅',
  },
] as const

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ── Hero section ── */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-12">
        {/* Demo mode notice */}
        <p className="text-xs font-medium tracking-widest uppercase text-[#B45309] mb-6">
          Demo mode&nbsp;•&nbsp;Seeded/public-source records&nbsp;•&nbsp;No production BIS connection
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] tracking-tight mb-4">
          BIS Sarathi
        </h1>

        <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mb-3">
          AI-assisted navigation for BIS standards, labs, and consumer protection — SIH 2026 Concept Demonstrator
        </p>

        <p className="text-sm text-[#64748B] max-w-xl mb-10">
          An evidence-first conversational service layer for standards discovery, BIS workflows,
          verification guidance and laboratory discovery.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
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
      </section>

      {/* ── Capability cards ── */}
      <section className="px-6 pb-14 max-w-5xl mx-auto">
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
              <span className="text-2xl" role="presentation" aria-hidden="true">
                {card.icon}
              </span>
              <span className="text-sm font-semibold text-[#1B2A4A] group-hover:underline">
                {card.title}
              </span>
              <span className="text-xs text-[#64748B] leading-relaxed">
                {card.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Choose your journey ── */}
      <section className="border-t border-[#E2E8F0] bg-[#F8F9FA] px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-2">
            Choose your journey
          </h2>
          <p className="text-sm text-[#64748B] mb-8">
            Different entry points for industry users and consumers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Industry / MSME */}
            <Link
              href="/industry"
              className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] bg-white p-6 text-left transition-colors hover:border-[#1B2A4A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
            >
              <span className="text-xl" role="presentation" aria-hidden="true">🏭</span>
              <span className="text-sm font-semibold text-[#1B2A4A]">
                Industry / MSME
              </span>
              <span className="text-xs text-[#64748B] leading-relaxed">
                Identify the right standard, understand certification obligations,
                and discover testing labs for your product.
              </span>
              <span className="mt-2 text-xs font-medium text-[#FF671F]">
                Start industry journey →
              </span>
            </Link>

            {/* Consumer */}
            <Link
              href="/consumer"
              className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] bg-white p-6 text-left transition-colors hover:border-[#1B2A4A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B2A4A]"
            >
              <span className="text-xl" role="presentation" aria-hidden="true">🛒</span>
              <span className="text-sm font-semibold text-[#1B2A4A]">
                Consumer
              </span>
              <span className="text-xs text-[#64748B] leading-relaxed">
                Understand BIS marks, verify product safety, and prepare a
                structured complaint if you suspect a marking violation.
              </span>
              <span className="mt-2 text-xs font-medium text-[#FF671F]">
                Start consumer journey →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// BIS Sarathi — Footer
// Static footer with two-line text and four external links.
// Server component — no client-side hooks needed.
//
// Requirements: 1.6, 15.8

interface ExternalLink {
  label: string
  href: string
}

const EXTERNAL_LINKS: ExternalLink[] = [
  { label: 'Official BIS',    href: 'https://www.bis.gov.in' },
  { label: 'BIS Standards',   href: 'https://www.bis.gov.in/index.php/standards/' },
  { label: 'BIS LIMS',        href: 'https://www.bis.gov.in/index.php/labs/' },
  { label: 'BIS Care',        href: 'https://www.bis.gov.in/index.php/bis-care/' },
]

export function Footer() {
  return (
    <footer
      className="w-full border-t border-[#E2E8F0] bg-white px-4 md:px-6 py-6 mt-auto"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Text block */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#1B2A4A]">
            BIS Sarathi | SIH 2026 &bull; PS 26107 &bull; UDDAN
          </p>
          <p className="text-xs text-[#64748B]">
            Interactive concept demonstrator using seeded/public-source demo records.
            Not connected to BIS production systems.
          </p>
        </div>

        {/* External links */}
        <nav aria-label="External BIS resources">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {EXTERNAL_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in new tab)`}
                  className="text-xs text-[#1D4ED8] hover:underline transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

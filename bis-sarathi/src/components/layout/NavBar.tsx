'use client'

// BIS Sarathi — Top Navigation Bar
// Renders all 7 navigation links with active-link detection.
// Secondary links (Evidence, How It Works, Demo Data) carry class="nav-secondary"
// so the global CSS selector [data-presentation="true"] .nav-secondary hides
// them automatically in Presentation Mode.
//
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PresentationModeToggle } from '@/components/ui/PresentationModeToggle'

interface NavItem {
  label: string
  href: string
  secondary?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',         href: '/' },
  { label: 'Ask Sarathi',  href: '/ask' },
  { label: 'Industry',     href: '/industry' },
  { label: 'Consumer',     href: '/consumer' },
  { label: 'Evidence',     href: '/evidence',      secondary: true },
  { label: 'How It Works', href: '/how-it-works',  secondary: true },
  { label: 'Demo Data',    href: '/demo-data',     secondary: true },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="w-full bg-white border-b border-[#E2E8F0] px-4 md:px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
        {/* Brand */}
        <Link
          href="/"
          className="text-[#1B2A4A] font-bold text-sm tracking-widest uppercase shrink-0 mr-6"
          aria-label="BIS Sarathi — Home"
        >
          BIS Sarathi
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(({ label, href, secondary }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)

            return (
              <li
                key={href}
                className={secondary ? 'nav-secondary' : undefined}
              >
                <Link
                  href={href}
                  className={[
                    'relative whitespace-nowrap px-3 py-1.5 text-sm rounded transition-colors duration-150',
                    isActive
                      ? 'text-[#1B2A4A] font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#1B2A4A] after:rounded-full'
                      : 'text-[#64748B] hover:text-[#1B2A4A] hover:bg-[#F8F9FA]',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right: Presentation Mode Toggle */}
        <div className="shrink-0 ml-4">
          <PresentationModeToggle />
        </div>
      </div>
    </nav>
  )
}

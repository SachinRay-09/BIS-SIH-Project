// BIS Sarathi — Demo Banner
// Persistent top strip on every page.
// Always visible — including in Presentation Mode — because it is not a
// nav-secondary element and has no data-presentation display override.
//
// Requirements: 1.1

// Server component — no client-side hooks needed.

export function DemoBanner() {
  return (
    <div
      role="banner"
      aria-label="Interactive demo notice"
      style={{ backgroundColor: '#B45309' }}
      className="w-full px-4 py-1.5 text-center"
    >
      <p className="text-white text-xs font-semibold tracking-widest uppercase">
        INTERACTIVE DEMO &mdash; Uses seeded/public-source demonstration records.
        Not connected to BIS production systems.
      </p>
    </div>
  )
}

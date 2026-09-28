import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Global mock for next/navigation so client components using useRouter/usePathname
// can render in the jsdom test environment without crashing.
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

'use client'

// BIS Sarathi — Global application context
// Provides presentationMode state and the DOM side-effect that adds/removes
// data-presentation="true" on <html> when the mode is toggled.
//
// Using document.documentElement (the <html> element) rather than document.body
// is the SSR-safe pattern for Next.js App Router — the body element is not
// available during server rendering, but documentElement is stable.
//
// Requirements: 2.4, 2.5, 2.6

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Context value shape
// ─────────────────────────────────────────────────────────────────────────────

export interface AppContextValue {
  /** Whether Presentation Mode is currently active */
  presentationMode: boolean
  /**
   * Toggle Presentation Mode on/off.
   * Also updates the `data-presentation` attribute on `document.documentElement`
   * so that CSS selectors in globals.css can apply presentation overrides.
   */
  setPresentationMode: (v: boolean) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Context creation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The AppContext instance. Exported so consumers can subscribe via
 * `useContext(AppContext)` if they prefer — but the `useAppContext` hook
 * below is the recommended approach (it validates provider presence).
 */
export const AppContext = createContext<AppContextValue | undefined>(undefined)
AppContext.displayName = 'AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// Provider component
// ─────────────────────────────────────────────────────────────────────────────

interface AppContextProviderProps {
  children: React.ReactNode
}

/**
 * `AppContextProvider` wraps the root layout and makes `presentationMode`
 * available to the entire component tree.
 *
 * Place this as the outermost wrapper in `src/app/layout.tsx`, surrounding
 * DemoBanner, NavBar, and the page content.
 */
export function AppContextProvider({ children }: AppContextProviderProps) {
  const [presentationMode, setPresentationModeState] = useState(false)

  /**
   * Custom setter that keeps React state and the DOM attribute in sync.
   * Setting `data-presentation="true"` on `<html>` lets global CSS rules
   * (defined in globals.css) enlarge the UI, hide secondary nav items, and
   * adjust font sizes without requiring component-level re-renders for every
   * affected element.
   *
   * On deactivation the attribute is removed entirely (not set to "false")
   * so CSS attribute selectors [data-presentation="true"] are reliably absent.
   */
  const setPresentationMode = useCallback((v: boolean) => {
    setPresentationModeState(v)
    if (typeof document !== 'undefined') {
      if (v) {
        document.documentElement.setAttribute('data-presentation', 'true')
      } else {
        document.documentElement.removeAttribute('data-presentation')
      }
    }
  }, [])

  // Sync attribute on mount in case the state initialises from storage in future.
  // Currently state always starts as false, so this removes any stale attribute
  // that might be left from a previous session (e.g. hot-reload edge cases).
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (presentationMode) {
        document.documentElement.setAttribute('data-presentation', 'true')
      } else {
        document.documentElement.removeAttribute('data-presentation')
      }
    }
  }, [presentationMode])

  return (
    <AppContext.Provider value={{ presentationMode, setPresentationMode }}>
      {children}
    </AppContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `useAppContext` — the recommended way to read and update presentation mode
 * anywhere in the component tree.
 *
 * Throws a clear error if called outside an `AppContextProvider` so
 * misconfigured subtrees are caught at development time rather than producing
 * silent `undefined` values.
 *
 * @example
 * const { presentationMode, setPresentationMode } = useAppContext()
 */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (ctx === undefined) {
    throw new Error(
      'useAppContext must be used within an AppContextProvider. ' +
        'Ensure AppContextProvider wraps the root layout in src/app/layout.tsx.'
    )
  }
  return ctx
}

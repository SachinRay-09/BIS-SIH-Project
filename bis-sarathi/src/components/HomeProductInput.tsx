'use client'

// BIS Sarathi — HomeProductInput
// Client component: product description input on the Home page.
// On submit, navigates to /ask with the query pre-filled via URL params.
// The /ask page reads the ?q= param and auto-submits it.

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export function HomeProductInput() {
  const [value, setValue] = useState('')
  const router = useRouter()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    router.push(`/ask?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-xl"
      aria-label="Describe your product to find the right BIS standard"
    >
      <label htmlFor="home-product-input" className="sr-only">
        Describe your product
      </label>
      <input
        id="home-product-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. packaged drinking water, stainless steel bottles…"
        className="flex-1 px-4 py-2.5 text-sm rounded-md border border-[#E2E8F0] bg-white text-[#1A1A2E] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#243756] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2 whitespace-nowrap"
      >
        Find standard →
      </button>
    </form>
  )
}

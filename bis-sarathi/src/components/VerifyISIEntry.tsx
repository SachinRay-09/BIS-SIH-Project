'use client'

// BIS Sarathi — VerifyISIEntry
// F.1: Small client component for the "Verify ISI mark" entry on the Consumer page.
// Accepts a licence/HUID number and navigates to /ask?q=verify+<id>.
// Shows DEMO-LIC-001 result for the demo ID; abstention for anything else.

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export function VerifyISIEntry() {
  const [value, setValue] = useState('')
  const router = useRouter()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const id = value.trim()
    if (!id) return
    router.push(`/ask?q=${encodeURIComponent(`Can you verify this licence? ${id}`)}`)
  }

  function useDemoId() {
    setValue('DEMO-LIC-001')
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2"
        aria-label="Verify an ISI licence or HUID number"
      >
        <label htmlFor="verify-input" className="sr-only">Licence or HUID number</label>
        <input
          id="verify-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter licence number or HUID, e.g. DEMO-LIC-001"
          className="flex-1 px-3 py-2 text-sm rounded-md border border-[#E2E8F0] bg-white text-[#1A1A2E] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent"
          aria-label="Licence or HUID number to verify"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#1B2A4A] hover:bg-[#243756] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A4A] focus-visible:ring-offset-2 whitespace-nowrap"
        >
          Verify →
        </button>
      </form>
      <button
        type="button"
        onClick={useDemoId}
        className="self-start text-xs text-[#1D4ED8] underline underline-offset-2 hover:text-[#1B2A4A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1B2A4A] rounded"
      >
        Use demo ID: DEMO-LIC-001
      </button>
      <p className="text-[10px] text-[#94A3B8]">
        This demo only recognises DEMO-LIC-001. Any other input will trigger the grounding gate abstention — demonstrating safe failure.
      </p>
    </div>
  )
}

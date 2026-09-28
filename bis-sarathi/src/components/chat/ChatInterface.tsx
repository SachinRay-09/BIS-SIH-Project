'use client'

// BIS Sarathi — ChatInterface component
// The stateful container for the Ask Sarathi conversational UI (/ask).
//
// State:
//   messages       — conversation history (ChatMessage[])
//   input          — current text in the input field
//   isLoading      — true while the simulated loading sequence is running
//
// Submit flow:
//   1. Append user ChatMessage to messages
//   2. Set isLoading = true (shows LoadingSequence)
//   3. LoadingSequence calls onComplete → resolve promptId → look up response
//   4. Append assistant ChatMessage with the full PromptResponse payload
//   5. Set isLoading = false
//   6. Move focus to the new assistant message (accessibility)
//
// Empty state: QuickStartPrompts shown above the input when messages is empty.
// Focus: after quick-start click → input focused; after response → new message focused.
//
// Message list: role="log" aria-live="polite" (Requirements: 4.1 accessibility)
//
// Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import type { ChatMessage, PromptId, ScenarioId } from '@/lib/types'
import { resolvePrompt, QUICK_PROMPTS } from '@/lib/promptRouter'
import { responses } from '@/data/responses'
import LoadingSequence from './LoadingSequence'
import QuickStartPrompts from './QuickStartPrompts'
import DemoScenarioSwitcher from './DemoScenarioSwitcher'
import MessageBubble from './MessageBubble'

// ─────────────────────────────────────────────────────────────────────────────
// Scenario → prompt text map
// Maps a ScenarioId to the canonical quick-prompt text for that scenario.
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIO_PROMPT_MAP: Record<ScenarioId, string> = {
  INDUSTRY:     QUICK_PROMPTS.find((p) => p.id === 'PROMPT_DRINKING_WATER')!.prompt,
  LAB:          QUICK_PROMPTS.find((p) => p.id === 'PROMPT_LABS')!.prompt,
  CONSUMER:     QUICK_PROMPTS.find((p) => p.id === 'PROMPT_WHAT_IS_14543')!.prompt,
  VERIFICATION: QUICK_PROMPTS.find((p) => p.id === 'PROMPT_VERIFY')!.prompt,
  COMPLAINT:    QUICK_PROMPTS.find((p) => p.id === 'PROMPT_COMPLAINT')!.prompt,
  TRUST_TEST:   QUICK_PROMPTS.find((p) => p.id === 'PROMPT_ABSTAIN')!.prompt,
}

// Scenarios that have a forced/pinned PromptId regardless of keyword matching.
// TRUST_TEST must always resolve to PROMPT_ABSTAIN — the grounding gate demo.
const SCENARIO_FORCED_PROMPT_ID: Partial<Record<ScenarioId, PromptId>> = {
  TRUST_TEST: 'PROMPT_ABSTAIN',
}

// ─────────────────────────────────────────────────────────────────────────────
// ID generator — simple incrementing counter scoped to the component lifetime.
// Avoids crypto.randomUUID() which requires HTTPS in some environments.
// ─────────────────────────────────────────────────────────────────────────────

let _idCounter = 0
function nextId(): string {
  _idCounter += 1
  return `msg-${Date.now()}-${_idCounter}`
}

// ─────────────────────────────────────────────────────────────────────────────
// ChatInterface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `ChatInterface` is the main conversational UI for the Ask Sarathi page.
 *
 * It manages the full message lifecycle:
 *   - User input via the text field or quick-start prompt buttons
 *   - Animated loading sequence (simulated retrieval)
 *   - Deterministic response lookup from `data/responses.ts`
 *   - Rendering each message through `MessageBubble`
 *
 * Accessibility:
 *   - Message list: `role="log" aria-live="polite"` (per WCAG live region guidance)
 *   - After response: focus moves to the new assistant message
 *   - After quick-start selection: focus returns to input
 *
 * @example
 * <ChatInterface />
 */
export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('INDUSTRY')

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const pendingPromptRef = useRef<string | null>(null)
  const pendingForcedPromptIdRef = useRef<PromptId | null>(null)

  // ── Focus the last message after it renders ──────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      // Only focus assistant messages (last message after a response arrives)
      const last = messages[messages.length - 1]
      if (last.role === 'assistant') {
        lastMessageRef.current?.focus()
      }
    }
  }, [messages])

  // ─────────────────────────────────────────────────────────────────────────
  // submitPrompt — core submit handler.
  // Accepts a prompt string, appends the user message, starts loading.
  // The actual response lookup happens in handleLoadingComplete to keep
  // the LoadingSequence fully in charge of timing.
  // ─────────────────────────────────────────────────────────────────────────

  const submitPrompt = useCallback((promptText: string, forcedPromptId?: PromptId) => {
    const trimmed = promptText.trim()
    if (!trimmed || isLoading) return

    // Store the prompt text so handleLoadingComplete can look it up
    pendingPromptRef.current = trimmed
    pendingForcedPromptIdRef.current = forcedPromptId ?? null

    // Append user message
    const userMessage: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
  }, [isLoading])

  // ─────────────────────────────────────────────────────────────────────────
  // handleLoadingComplete — called by LoadingSequence when all steps finish.
  // Resolves the pending prompt and appends the assistant message.
  // ─────────────────────────────────────────────────────────────────────────

  const handleLoadingComplete = useCallback(() => {
    const promptText = pendingPromptRef.current
    if (!promptText) {
      setIsLoading(false)
      return
    }

    // Use forced PromptId if set (e.g. TRUST_TEST always → PROMPT_ABSTAIN),
    // otherwise resolve from the prompt text via keyword matching.
    const promptId = pendingForcedPromptIdRef.current ?? resolvePrompt(promptText)
    const promptResponse = responses[promptId]

    const assistantMessage: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      content: promptResponse.assistantMessage,
      promptResponse,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    pendingPromptRef.current = null
    pendingForcedPromptIdRef.current = null
    setIsLoading(false)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Form submission
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submitPrompt(input)
    },
    [input, submitPrompt]
  )

  // Enter key in textarea (if we ever switch) — keeping as keyboard guard on input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submitPrompt(input)
      }
    },
    [input, submitPrompt]
  )

  // ─────────────────────────────────────────────────────────────────────────
  // Quick-start prompt selection
  // Sets the input text and submits immediately.
  // After submission, focus returns to the input (handled in submitPrompt).
  // ─────────────────────────────────────────────────────────────────────────

  const handleQuickPromptSelect = useCallback(
    (promptText: string) => {
      submitPrompt(promptText)
      // Focus the input after a tick so the loading state is set first
      setTimeout(() => inputRef.current?.focus(), 50)
    },
    [submitPrompt]
  )

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario switcher
  // Updates the active scenario and fires the corresponding prompt.
  // ─────────────────────────────────────────────────────────────────────────

  const handleScenarioChange = useCallback(
    (id: ScenarioId) => {
      setActiveScenario(id)
      const promptText = SCENARIO_PROMPT_MAP[id]
      const forcedPromptId = SCENARIO_FORCED_PROMPT_ID[id]
      submitPrompt(promptText, forcedPromptId)
    },
    [submitPrompt]
  )

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full min-h-0 w-full">

      {/* ── Demo Scenario Switcher — always visible ──────────────────────── */}
      <div className="px-4 pt-4 pb-2 border-b border-[#E2E8F0] bg-white">
        <DemoScenarioSwitcher
          activeScenario={activeScenario}
          onScenarioChange={handleScenarioChange}
        />
      </div>

      {/* ── Message list ─────────────────────────────────────────────────── */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0"
      >
        {/* Empty state — show quick-start prompts */}
        {isEmpty && !isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 py-8">
            {/* Welcome heading */}
            <div className="text-center max-w-md">
              <h2 className="text-lg font-semibold text-[#1B2A4A] mb-1">
                Ask Sarathi
              </h2>
              <p className="text-sm text-[#64748B]">
                Ask about BIS standards, laboratories, certification, complaints, or mark verification.
                Select a scenario below or type your own question.
              </p>
            </div>
            {/* Quick-start prompt buttons */}
            <div className="w-full max-w-2xl">
              <QuickStartPrompts onSelect={handleQuickPromptSelect} />
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1
          // Only attach the ref to the last message for focus management
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              ref={isLast ? lastMessageRef : undefined}
            />
          )
        })}

        {/* Loading sequence — shown while isLoading */}
        {isLoading && (
          <div className="flex items-start w-full">
            <LoadingSequence onComplete={handleLoadingComplete} />
          </div>
        )}
      </div>

      {/* ── Input area ───────────────────────────────────────────────────── */}
      <div className="border-t border-[#E2E8F0] bg-white px-4 py-3">
        {/* Quick-start prompts above input (only when there are already messages) */}
        {!isEmpty && !isLoading && messages[messages.length - 1]?.role === 'assistant' && (
          <div className="mb-3">
            <p className="text-xs text-[#94A3B8] mb-2">Try another scenario:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.slice(0, 3).map((qp) => (
                <button
                  key={qp.id}
                  type="button"
                  onClick={() => handleQuickPromptSelect(qp.prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-[#1B2A4A] hover:text-[#1B2A4A] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:ring-offset-1"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
          aria-label="Message input"
        >
          <label htmlFor="chat-input" className="sr-only">
            Ask Sarathi
          </label>
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about BIS standards, labs, certification…"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            aria-label="Type your question"
            aria-disabled={isLoading}
            className={[
              'flex-1 px-4 py-2.5 rounded-lg border text-sm',
              'bg-white border-[#E2E8F0] text-[#1A1A2E] placeholder-[#94A3B8]',
              'focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]',
              'transition-colors duration-150',
              isLoading ? 'opacity-50 cursor-not-allowed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className={[
              'flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:ring-offset-1',
              isLoading || !input.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#1B2A4A] text-white hover:bg-[#243756] active:bg-[#1B2A4A]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            Send
          </button>
        </form>

        {/* Disclaimer label */}
        <p className="mt-2 text-[10px] text-[#94A3B8] text-center">
          Simulated demo — responses sourced from seeded BIS data only.
        </p>
      </div>
    </div>
  )
}

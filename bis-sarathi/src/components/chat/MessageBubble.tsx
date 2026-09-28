'use client'

// BIS Sarathi — MessageBubble component
// Renders a single ChatMessage in the conversation history.
//
// User messages:   right-aligned, navy (#1B2A4A) background, white text.
// Assistant messages: left-aligned, white background, slate border.
//
// For assistant messages, inline cards are rendered below the text bubble
// based on the promptResponse.responseType discriminant:
//
//   STANDARDS_DISCOVERY  → ProductUnderstandingCard + CandidateStandardCard(s) + EvidenceCard(s)
//   LAB_DISCOVERY        → LabCard(s) + EvidenceCard(s)
//   CONSUMER_EXPLANATION → EvidenceCard(s)
//   COMPLAINT_DRAFT      → ComplaintDraftCard
//   VERIFICATION_RESULT  → VerificationResult
//   ABSTENTION           → AbstentionResponse
//
// Evidence card IDs and lab record IDs are resolved at render time from the
// canonical data arrays in data/evidence.ts and data/labs.ts respectively.
//
// A ServiceTracePanel is rendered below the cards for every assistant message.
//
// Requirements: 4.1, 4.5, 4.8

import { forwardRef } from 'react'
import type { ChatMessage, EvidenceRecord, LabRecord } from '@/lib/types'
import { evidenceRecords } from '@/data/evidence'
import { labs } from '@/data/labs'
import { EvidenceCard } from '@/components/cards/EvidenceCard'
import { ProductUnderstandingCard } from '@/components/cards/ProductUnderstandingCard'
import { CandidateStandardCard } from '@/components/cards/CandidateStandardCard'
import { LabCard } from '@/components/cards/LabCard'
import { VerificationResult } from '@/components/cards/VerificationResult'
import { ComplaintDraftCard } from '@/components/cards/ComplaintDraftCard'
import { AbstentionResponse } from '@/components/cards/AbstentionResponse'
import { ServiceTracePanel } from '@/components/chat/ServiceTracePanel'

// ─────────────────────────────────────────────────────────────────────────────
// ID resolution helpers
// ─────────────────────────────────────────────────────────────────────────────

function resolveEvidenceIds(ids: string[]): EvidenceRecord[] {
  return ids
    .map((id) => evidenceRecords.find((r) => r.id === id))
    .filter((r): r is EvidenceRecord => r !== undefined)
}

function resolveLabIds(ids: string[]): LabRecord[] {
  return ids
    .map((id) => labs.find((l) => l.id === id))
    .filter((l): l is LabRecord => l !== undefined)
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline cards renderer
// Returns the card components appropriate for this response type.
// Only called for assistant messages with a promptResponse attached.
// ─────────────────────────────────────────────────────────────────────────────

function AssistantCards({ message }: { message: ChatMessage }) {
  const pr = message.promptResponse
  if (!pr) return null

  const evidenceCardIds = pr.evidenceCards ?? []
  const resolvedEvidence = resolveEvidenceIds(evidenceCardIds)

  switch (pr.responseType) {
    case 'STANDARDS_DISCOVERY': {
      const resolvedLabs = resolveLabIds(pr.labRecords ?? [])
      return (
        <div className="flex flex-col gap-3 mt-3 w-full">
          {/* Product understanding card */}
          {pr.productUnderstanding && (
            <ProductUnderstandingCard data={pr.productUnderstanding} />
          )}
          {/* Candidate standard cards */}
          {(pr.candidateStandards ?? []).map((std) => (
            <CandidateStandardCard key={std.standardId} standard={std} />
          ))}
          {/* Lab cards (shouldn't appear on STANDARDS_DISCOVERY but guarded) */}
          {resolvedLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
          {/* Evidence cards */}
          {resolvedEvidence.map((rec) => (
            <EvidenceCard key={rec.id} record={rec} />
          ))}
        </div>
      )
    }

    case 'LAB_DISCOVERY': {
      const resolvedLabs = resolveLabIds(pr.labRecords ?? [])
      return (
        <div className="flex flex-col gap-3 mt-3 w-full">
          {/* Lab cards */}
          {resolvedLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
          {/* Evidence cards */}
          {resolvedEvidence.map((rec) => (
            <EvidenceCard key={rec.id} record={rec} />
          ))}
        </div>
      )
    }

    case 'CONSUMER_EXPLANATION': {
      return (
        <div className="flex flex-col gap-3 mt-3 w-full">
          {resolvedEvidence.map((rec) => (
            <EvidenceCard key={rec.id} record={rec} />
          ))}
        </div>
      )
    }

    case 'COMPLAINT_DRAFT': {
      const fields = pr.complaintFields ?? []
      return (
        <div className="mt-3 w-full">
          <ComplaintDraftCard fields={fields} />
        </div>
      )
    }

    case 'VERIFICATION_RESULT': {
      if (!pr.verificationResult) return null
      return (
        <div className="mt-3 w-full">
          <VerificationResult result={pr.verificationResult} />
        </div>
      )
    }

    case 'ABSTENTION': {
      return (
        <div className="mt-3 w-full">
          <AbstentionResponse
            message={pr.abstentionMessage ?? pr.assistantMessage}
            reasons={pr.abstentionReasons ?? [
              'No authoritative evidence found in the available BIS dataset for this query.',
              'Insufficient current regulatory data to provide a grounded response.',
            ]}
          />
        </div>
      )
    }

    default:
      // Render evidence cards as a safe fallback for any unhandled response type
      return resolvedEvidence.length > 0 ? (
        <div className="flex flex-col gap-3 mt-3 w-full">
          {resolvedEvidence.map((rec) => (
            <EvidenceCard key={rec.id} record={rec} />
          ))}
        </div>
      ) : null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `MessageBubble` renders a single message in the BIS Sarathi chat interface.
 *
 * - User messages: right-aligned, deep navy background (#1B2A4A), white text.
 * - Assistant messages: left-aligned, white background, slate border,
 *   with inline card components below the text.
 *
 * The component is wrapped in `forwardRef` so the parent `ChatInterface` can
 * move focus to the most recent assistant message after it appears.
 *
 * @example
 * <MessageBubble message={chatMessage} ref={lastMessageRef} />
 */
const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  function MessageBubble({ message }, ref) {
    const isUser = message.role === 'user'
    const isAssistant = message.role === 'assistant'

    if (isUser) {
      return (
        <div
          ref={ref}
          className="flex justify-end w-full"
          aria-label="Your message"
        >
          <div
            style={{ backgroundColor: '#1B2A4A', color: '#FFFFFF' }}
            className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm"
            tabIndex={-1}
          >
            {message.content}
          </div>
        </div>
      )
    }

    if (isAssistant) {
      const pr = message.promptResponse

      return (
        <div
          ref={ref}
          className="flex flex-col items-start w-full gap-0"
          aria-label="Sarathi response"
          tabIndex={-1}
        >
          {/* ── Sarathi label ──────────────────────────────────────────────── */}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] mb-1.5 ml-1">
            Sarathi
          </span>

          {/* ── Text bubble ───────────────────────────────────────────────── */}
          <div
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            className="max-w-[85%] w-full px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm text-[#1A1A2E]"
          >
            {message.content}
          </div>

          {/* ── Inline cards ──────────────────────────────────────────────── */}
          <div className="w-full max-w-[85%] flex flex-col gap-0">
            {pr && <AssistantCards message={message} />}
          </div>

          {/* ── Service trace panel ───────────────────────────────────────── */}
          {pr?.serviceTrace && (
            <div className="w-full max-w-[85%] mt-1">
              <ServiceTracePanel trace={pr.serviceTrace} />
            </div>
          )}
        </div>
      )
    }

    return null
  }
)

MessageBubble.displayName = 'MessageBubble'

export default MessageBubble

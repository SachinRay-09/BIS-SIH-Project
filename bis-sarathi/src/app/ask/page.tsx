import type { Metadata } from 'next'
import ChatInterface from '@/components/chat/ChatInterface'

export const metadata: Metadata = {
  title: 'Ask Sarathi — BIS Standards Navigator',
  description:
    'Ask about BIS standards, labs, certification, complaints, and licence verification.',
}

interface AskPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function AskPage({ searchParams }: AskPageProps) {
  const { q } = await searchParams
  const initialQuery = q ? decodeURIComponent(q) : undefined

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatInterface initialQuery={initialQuery} />
    </div>
  )
}

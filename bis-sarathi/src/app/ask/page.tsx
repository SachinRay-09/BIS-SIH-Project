import type { Metadata } from 'next'
import ChatInterface from '@/components/chat/ChatInterface'

export const metadata: Metadata = {
  title: 'Ask Sarathi — BIS Standards Navigator',
  description:
    'Ask about BIS standards, labs, certification, complaints, and licence verification.',
}

export default function AskPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatInterface />
    </div>
  )
}

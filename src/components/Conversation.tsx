import type { ReactElement } from 'react'
import type { ConversationSummary } from '../types/conversation'

interface ConversationProps {
  conversation: ConversationSummary
}

export function Conversation({ conversation }: ConversationProps): ReactElement {
  return (
    <article>
      <h2>{conversation.correspondantNickname}</h2>
      <p>{conversation.lastMessageDate}</p>
    </article>
  )
}

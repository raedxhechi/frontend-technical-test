import type { ReactElement } from 'react'
import { Conversation } from './Conversation'
import type { Conversation as ConversationType } from '../types/conversation'
import type { User } from '../types/user'
import { convertConversation } from '../utils/convertConversation'

interface ConversationListProps {
  conversations: ConversationType[]
  userId: User['id']
}

export function ConversationList({
  conversations,
  userId,
}: ConversationListProps): ReactElement {

  const mostRecentFirst = [...conversations].sort(
    (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp,
  )

  return (
    <ul>
      {mostRecentFirst.map((conversation) => (
        <li key={conversation.id}>
          <Conversation conversation={convertConversation(conversation, userId)} />
        </li>
      ))}
    </ul>
  )
}

import type { ReactElement } from 'react'
import { useRef } from 'react'
import { Conversation } from './Conversation'
import type { ConversationWithLastMessage } from '../types/conversation'
import type { User } from '../types/user'
import { useReorderAnimation } from '../hooks/useReorderAnimation'
import { convertConversation } from '../utils/convertConversation'
import styles from './ConversationList.module.css'

interface ConversationListProps {
  conversations: ConversationWithLastMessage[]
  userId: User['id']
  selectedConversationId?: ConversationWithLastMessage['id']
}

export function ConversationList({
  conversations,
  userId,
  selectedConversationId,
}: ConversationListProps): ReactElement {

  const listRef = useRef<HTMLUListElement>(null)
  useReorderAnimation(listRef)

  const mostRecentFirst = [...conversations].sort(
    (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp,
  )

  return (
    <ul ref={listRef} className={styles.list}>
      {mostRecentFirst.map((conversation) => (
        <li key={conversation.id} data-animate-key={conversation.id}>
          <Conversation
            conversation={convertConversation(conversation, userId)}
            isSelected={conversation.id === selectedConversationId}
          />
        </li>
      ))}
    </ul>
  )
}

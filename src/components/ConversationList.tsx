import type { ReactElement } from 'react'
import { Conversation } from './Conversation'
import type { Conversation as ConversationType } from '../types/conversation'
import type { User } from '../types/user'
import { convertConversation } from '../utils/convertConversation'
import styles from './ConversationList.module.css'

interface ConversationListProps {
  conversations: ConversationType[]
  userId: User['id']
  selectedConversationId?: ConversationType['id']
}

export function ConversationList({
  conversations,
  userId,
  selectedConversationId,
}: ConversationListProps): ReactElement {

  const mostRecentFirst = [...conversations].sort(
    (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp,
  )

  return (
    <ul className={styles.list}>
      {mostRecentFirst.map((conversation) => (
        <li key={conversation.id}>
          <Conversation
            conversation={convertConversation(conversation, userId)}
            isSelected={conversation.id === selectedConversationId}
          />
        </li>
      ))}
    </ul>
  )
}

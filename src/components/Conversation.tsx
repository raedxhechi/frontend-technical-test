import type { ReactElement } from 'react'
import Link from 'next/link'
import { Avatar } from './Avatar'
import type { ConversationSummary } from '../types/conversation'
import styles from './Conversation.module.css'

interface ConversationProps {
  conversation: ConversationSummary
  isSelected?: boolean
}


export function Conversation({ conversation, isSelected = false }: ConversationProps): ReactElement {
  return (
    <Link
      className={styles.conversation}
      href={`/conversations/${conversation.id}`}
      aria-current={isSelected ? 'page' : undefined}
    >
      <Avatar nickname={conversation.correspondantNickname} />

      <span className={styles.details}>
        <span className={styles.nickname}>{conversation.correspondantNickname}</span>
        <span className={styles.date}>{conversation.lastMessageDate}</span>
      </span>
    </Link>
  )
}

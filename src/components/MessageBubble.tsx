import type { ReactElement } from 'react'
import type { MessageSummary } from '../types/message'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  message: MessageSummary
}

export function MessageBubble({ message }: MessageBubbleProps): ReactElement {
  return (
    <div className={styles.bubble} data-own={message.isFromLoggedUser}>
      <p className={styles.body}>{message.body}</p>
      <span className={styles.time}>{message.time}</span>
    </div>
  )
}

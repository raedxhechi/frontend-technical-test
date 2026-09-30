import type { ReactElement } from 'react'
import type { MessageSummary } from '../types/message'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  message: MessageSummary
  hasFailed?: boolean
}

export function MessageBubble({ message, hasFailed = false }: MessageBubbleProps): ReactElement {
  return (
    <div className={styles.bubble} data-own={message.isFromLoggedUser} data-failed={hasFailed}>
      <p className={styles.body}>{message.body}</p>

      <span className={styles.footer}>
        {message.isPending && !hasFailed && <span className={styles.spinner} role="status" aria-label="Envoi en cours" />}
        <span className={styles.time}>{message.time}</span>
      </span>
    </div>
  )
}

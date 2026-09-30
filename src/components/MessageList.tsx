import type { ReactElement } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '../types/message'
import type { User } from '../types/user'
import { convertMessage } from '../utils/convertMessage'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  userId: User['id']
}

export function MessageList({ messages, userId }: MessageListProps): ReactElement {
  const oldestFirst = [...messages].sort((a, b) => a.timestamp - b.timestamp)

  return (
    <ul className={styles.list}>
      {oldestFirst.map((message) => {
        const summary = convertMessage(message, userId)

        return (
          <li key={summary.id} className={styles.item} data-own={summary.isFromLoggedUser}>
            <MessageBubble message={summary} />
          </li>
        )
      })}
    </ul>
  )
}

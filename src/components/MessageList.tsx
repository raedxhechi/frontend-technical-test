import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '../types/message'
import type { User } from '../types/user'
import { convertMessage } from '../utils/convertMessage'
import { formatMessageDay } from '../utils/formatMessageDay'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  userId: User['id']
  failedMessages?: Message[]
  onRetry?: (message: Message) => void
}

interface DayGroup {
  label: string
  messages: Message[]
}

function groupByDay(messages: Message[]): DayGroup[] {
  return messages.reduce<DayGroup[]>((groups, message) => {
    const label = formatMessageDay(message.timestamp)
    const currentGroup = groups[groups.length - 1]

    if (currentGroup?.label === label) {
      currentGroup.messages.push(message)
    } else {
      groups.push({ label, messages: [message] })
    }

    return groups
  }, [])
}

export function MessageList({
  messages,
  userId,
  failedMessages = [],
  onRetry,
}: MessageListProps): ReactElement {
  const failedIds = new Set(failedMessages.map((message) => message.id))
  const oldestFirst = [...messages, ...failedMessages].sort((a, b) => a.timestamp - b.timestamp)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <div className={styles.thread}>
      {groupByDay(oldestFirst).map((group) => (
        <section key={group.label} className={styles.group} aria-label={group.label}>
          <p className={styles.separator}>{group.label}</p>

          <ul className={styles.list}>
            {group.messages.map((message) => {
              const summary = convertMessage(message, userId)
              const hasFailed = failedIds.has(message.id)

              return (
                <li key={summary.id} className={styles.item} data-own={summary.isFromLoggedUser}>
                  <MessageBubble message={summary} hasFailed={hasFailed} />

                  {hasFailed && (
                    <button
                      type="button"
                      className={styles.retry}
                      onClick={() => onRetry?.(message)}
                    >
                      Échec de l’envoi. Réessayer
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <div ref={bottomRef} className={styles.bottomAnchor} />
    </div>
  )
}

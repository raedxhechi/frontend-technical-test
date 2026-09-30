import type { ReactElement } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '../types/message'
import type { User } from '../types/user'
import { convertMessage } from '../utils/convertMessage'
import { formatMessageDay } from '../utils/formatMessageDay'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  userId: User['id']
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

export function MessageList({ messages, userId }: MessageListProps): ReactElement {
  const oldestFirst = [...messages].sort((a, b) => a.timestamp - b.timestamp)

  return (
    <div className={styles.thread}>
      {groupByDay(oldestFirst).map((group) => (
        <section key={group.label} className={styles.group} aria-label={group.label}>
          <p className={styles.separator}>{group.label}</p>

          <ul className={styles.list}>
            {group.messages.map((message) => {
              const summary = convertMessage(message, userId)

              return (
                <li key={summary.id} className={styles.item} data-own={summary.isFromLoggedUser}>
                  <MessageBubble message={summary} />
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

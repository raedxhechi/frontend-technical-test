import type { ReactElement, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { ConversationHeader } from './ConversationHeader'
import { ConversationList } from './ConversationList'
import { useListConversations } from '../hooks/useListConversations'
import { convertConversation } from '../utils/convertConversation'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import styles from './MessagingLayout.module.css'

interface MessagingLayoutProps {
  children: ReactNode
}


export function MessagingLayout({ children }: MessagingLayoutProps): ReactElement {
  const userId = getLoggedUserId()
  const { data: conversations, isPending, isError } = useListConversations(userId)


  const { query } = useRouter()
  const selectedConversationId = typeof query.id === 'string' ? Number(query.id) : undefined

  const selectedConversation = conversations?.find(
    (conversation) => conversation.id === selectedConversationId,
  )

  return (
    <div className={styles.layout} data-thread-open={selectedConversationId !== undefined}>
      <aside className={styles.sidebar} aria-label="Conversations">
        <h1 className={styles.title}>Conversations</h1>

        {isPending && <p className={styles.state}>Chargement des conversations…</p>}
        {isError && <p className={styles.state}>Les conversations n’ont pas pu être chargées.</p>}

        {conversations && (
          <div className={styles.scroller}>
            <ConversationList
              conversations={conversations}
              userId={userId}
              selectedConversationId={selectedConversationId}
            />
          </div>
        )}
      </aside>

      <section className={styles.thread}>
        {selectedConversationId !== undefined && (
          <ConversationHeader
            correspondantNickname={
              selectedConversation
                ? convertConversation(selectedConversation, userId).correspondantNickname
                : undefined
            }
          />
        )}

        <div className={styles.threadContent}>{children}</div>
      </section>
    </div>
  )
}

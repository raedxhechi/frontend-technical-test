import type { ReactElement, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { ConversationHeader } from './ConversationHeader'
import { ConversationList } from './ConversationList'
import { useListConversationsWithLastMessage } from '../hooks/useListConversationsWithLastMessage'
import { convertConversation } from '../utils/convertConversation'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import styles from './MessagingLayout.module.css'

interface MessagingLayoutProps {
  children: ReactNode
  footer?: ReactNode | false
}


export function MessagingLayout({ children, footer }: MessagingLayoutProps): ReactElement {
  const userId = getLoggedUserId()
  const { data: conversations, isPending, isError } = useListConversationsWithLastMessage(userId)


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

        {conversations?.length === 0 && (
          <p className={styles.state}>Vous n’avez aucune conversation.</p>
        )}

        {conversations && conversations.length > 0 && (
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

        {footer}
      </section>
    </div>
  )
}

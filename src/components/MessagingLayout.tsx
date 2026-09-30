import type { ReactElement, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { ConversationHeader } from './ConversationHeader'
import { ConversationList } from './ConversationList'
import { NewConversation } from './NewConversation'
import { ConversationListSkeleton } from './ConversationListSkeleton'
import { useListConversationsWithLastMessage } from '../hooks/useListConversationsWithLastMessage'
import { convertConversation } from '../utils/convertConversation'
import { getLoggedUserId } from '../utils/getLoggedUserId'
import styles from './MessagingLayout.module.css'

const CONVERSATION_ROUTE = '/conversations/[id]'

interface MessagingLayoutProps {
  children: ReactNode
  footer?: ReactNode | false
}


export function MessagingLayout({ children, footer }: MessagingLayoutProps): ReactElement {
  const userId = getLoggedUserId()
  const {
    data: conversations,
    isPending,
    isError,
    refetch,
  } = useListConversationsWithLastMessage(userId)


  const { pathname, query } = useRouter()
  const isThreadOpen = pathname === CONVERSATION_ROUTE
  const selectedConversationId = typeof query.id === 'string' ? Number(query.id) : undefined

  const selectedConversation = conversations?.find(
    (conversation) => conversation.id === selectedConversationId,
  )

  return (
    <div className={styles.layout} data-thread-open={isThreadOpen}>
      <aside className={styles.sidebar} aria-label="Conversations">
        <header className={styles.header}>
          <h1 className={styles.title}>Conversations</h1>

          <NewConversation conversations={conversations ?? []} userId={userId} />
        </header>

        {isPending && <ConversationListSkeleton />}
        {isError && (
          <div className={styles.state}>
            <p className={styles.stateText}>Les conversations n’ont pas pu être chargées.</p>

            <button type="button" className={styles.retry} onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        )}

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
        {isThreadOpen && (
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

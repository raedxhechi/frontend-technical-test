import type { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MessageComposer } from '../../components/MessageComposer'
import { MessageList } from '../../components/MessageList'
import { MessagingLayout } from '../../components/MessagingLayout'
import { useListMessages } from '../../hooks/useListMessages'
import { useSendMessage } from '../../hooks/useSendMessage'
import { getLoggedUserId } from '../../utils/getLoggedUserId'
import styles from '../../styles/ConversationThread.module.css'

export default function ConversationPage(): ReactElement {
  const userId = getLoggedUserId()
  const { query } = useRouter()
  const conversationId = typeof query.id === 'string' ? Number(query.id) : undefined
  const { data: messages, isPending, isError, refetch } = useListMessages(conversationId)
  const { send, retry, failedMessages } = useSendMessage(conversationId ?? 0, userId)

  return (
    <>
      <Head>
        <title>Conversation - leboncoin</title>
      </Head>

      <MessagingLayout
        footer={conversationId !== undefined && <MessageComposer onSend={send} />}
      >
        {isPending && <p>Chargement des messages…</p>}
        {isError && (
          <div className={styles.error}>
            <p className={styles.errorText}>Les messages n’ont pas pu être chargés.</p>

            <button type="button" className={styles.retry} onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        )}
        {messages?.length === 0 && failedMessages.length === 0 && (
          <p>Aucun message dans cette conversation.</p>
        )}

        {messages && (messages.length > 0 || failedMessages.length > 0) && (
          <MessageList
            messages={messages}
            userId={userId}
            failedMessages={failedMessages}
            onRetry={retry}
          />
        )}
      </MessagingLayout>
    </>
  )
}

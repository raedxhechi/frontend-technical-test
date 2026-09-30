import type { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MessageComposer } from '../../components/MessageComposer'
import { MessageList } from '../../components/MessageList'
import { MessagingLayout } from '../../components/MessagingLayout'
import { useListMessages } from '../../hooks/useListMessages'
import { useSendMessage } from '../../hooks/useSendMessage'
import { getLoggedUserId } from '../../utils/getLoggedUserId'

export default function ConversationPage(): ReactElement {
  const userId = getLoggedUserId()
  const { query } = useRouter()
  const conversationId = typeof query.id === 'string' ? Number(query.id) : undefined
  const { data: messages, isPending, isError } = useListMessages(conversationId)
  const { mutate: send } = useSendMessage(conversationId ?? 0, userId)

  return (
    <>
      <Head>
        <title>Conversation - leboncoin</title>
      </Head>

      <MessagingLayout
        footer={conversationId !== undefined && <MessageComposer onSend={send} />}
      >
        {isPending && <p>Chargement des messages…</p>}
        {isError && <p>Les messages n’ont pas pu être chargés.</p>}
        {messages?.length === 0 && <p>Aucun message dans cette conversation.</p>}

        {messages && messages.length > 0 && <MessageList messages={messages} userId={userId} />}
      </MessagingLayout>
    </>
  )
}

import type { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MessagingLayout } from '../../components/MessagingLayout'

export default function ConversationPage(): ReactElement {
  const { query } = useRouter()
  const conversationId = typeof query.id === 'string' ? query.id : ''

  return (
    <>
      <Head>
        <title>Conversation - leboncoin</title>
      </Head>

      <MessagingLayout>
        <p>Messages de la conversation {conversationId}</p>
      </MessagingLayout>
    </>
  )
}

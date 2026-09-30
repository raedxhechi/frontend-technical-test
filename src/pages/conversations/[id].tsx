import type { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MessagingLayout } from '../../components/MessagingLayout'
import { useListMessages } from '../../hooks/useListMessages'

export default function ConversationPage(): ReactElement {
  const { query } = useRouter()
  const conversationId = typeof query.id === 'string' ? Number(query.id) : undefined
  const { data: messages, isPending, isError } = useListMessages(conversationId)

  return (
    <>
      <Head>
        <title>Conversation - leboncoin</title>
      </Head>

      <MessagingLayout>
        {isPending && <p>Chargement des messages…</p>}
        {isError && <p>Les messages n’ont pas pu être chargés.</p>}

        <pre>{JSON.stringify(messages, null, 2)}</pre>
      </MessagingLayout>
    </>
  )
}

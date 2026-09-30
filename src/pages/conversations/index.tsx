import type { ReactElement } from 'react'
import Head from 'next/head'
import { useListConversations } from '../../hooks/useListConversations'
import { getLoggedUserId } from '../../utils/getLoggedUserId'

export default function ConversationsPage(): ReactElement {
  const { data: conversations, isPending, isError } = useListConversations(getLoggedUserId())

  return (
    <>
      <Head>
        <title>Messages - leboncoin</title>
      </Head>

      <main>
        <h1>Messages</h1>

        {isPending && <p>Chargement des conversations…</p>}
        {isError && <p>Les conversations n’ont pas pu être chargées.</p>}

        <pre>{JSON.stringify(conversations, null, 2)}</pre>
      </main>
    </>
  )
}

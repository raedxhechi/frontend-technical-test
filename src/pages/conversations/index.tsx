import type { ReactElement } from 'react'
import Head from 'next/head'
import { ConversationList } from '../../components/ConversationList'
import { useListConversations } from '../../hooks/useListConversations'
import { getLoggedUserId } from '../../utils/getLoggedUserId'

export default function ConversationsPage(): ReactElement {
  const userId = getLoggedUserId()
  const { data: conversations, isPending, isError } = useListConversations(userId)

  return (
    <>
      <Head>
        <title>Conversations - leboncoin</title>
      </Head>

      <main>
        <h1>Conversations</h1>

        {isPending && <p>Chargement des conversations…</p>}
        {isError && <p>Les conversations n’ont pas pu être chargées.</p>}

        {conversations && <ConversationList conversations={conversations} userId={userId} />}
      </main>
    </>
  )
}

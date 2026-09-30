import type { ReactElement } from 'react'
import Head from 'next/head'
import { MessagingLayout } from '../../components/MessagingLayout'
import styles from '../../styles/ConversationThread.module.css'

export default function ConversationsPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Conversations - leboncoin</title>
      </Head>

      <MessagingLayout>
        <p className={styles.placeholder}>
          Sélectionnez une conversation pour afficher les messages.
        </p>
      </MessagingLayout>
    </>
  )
}

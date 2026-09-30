import type { ReactElement } from 'react'
import Head from 'next/head'
import styles from '../styles/UserNotFound.module.css'

export default function UserNotFoundPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Utilisateur introuvable - leboncoin</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Utilisateur introuvable</h1>
        <p className={styles.description}>
          Nous n’avons pas trouvé le compte associé à cette session.
        </p>
      </main>
    </>
  )
}

import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import Head from 'next/head'
import { getUser } from '../services/users'
import { getLoggedUserId } from '../utils/getLoggedUserId'

export default function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>Utilisateur introuvable - leboncoin</title>
      </Head>

      <main>
        <h1>Utilisateur introuvable</h1>
        <p>Nous n’avons pas trouvé le compte associé à cette session.</p>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const user = await getUser(getLoggedUserId())


  if (user) {
    console.log({user})
    return {
      redirect: {
        destination: '/conversations',
        permanent: false,
      },
    }
  }

  return { props: {} }
}

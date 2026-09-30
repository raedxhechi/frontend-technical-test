import type { ReactElement } from 'react'
import Link from 'next/link'
import { Avatar } from './Avatar'
import styles from './ConversationHeader.module.css'

interface ConversationHeaderProps {
  correspondantNickname?: string
}

export function ConversationHeader({
  correspondantNickname,
}: ConversationHeaderProps): ReactElement {
  return (
    <header className={styles.header}>
      <Link className={styles.back} href="/conversations" aria-label="Retour aux conversations">
        ←
      </Link>

      {correspondantNickname && (
        <>
          <Avatar nickname={correspondantNickname} />
          <span className={styles.nickname}>{correspondantNickname}</span>
        </>
      )}
    </header>
  )
}

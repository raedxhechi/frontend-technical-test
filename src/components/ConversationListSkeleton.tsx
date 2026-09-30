import type { ReactElement } from 'react'
import styles from './ConversationListSkeleton.module.css'

const PLACEHOLDER_ROWS = 6

export function ConversationListSkeleton(): ReactElement {
  return (
    <div className={styles.skeleton} role="status" aria-label="Chargement des conversations">
      {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
        <div key={index} className={styles.row} aria-hidden="true">
          <span className={styles.avatar} />

          <span className={styles.lines}>
            <span className={styles.nickname} />
            <span className={styles.date} />
          </span>
        </div>
      ))}
    </div>
  )
}

import type { ReactElement } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  nickname: string
}

export function Avatar({ nickname }: AvatarProps): ReactElement {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {nickname.charAt(0).toUpperCase()}
    </span>
  )
}

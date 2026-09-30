import type { FormEvent, ReactElement } from 'react'
import { useState } from 'react'
import styles from './MessageComposer.module.css'

const MAX_MESSAGE_LENGTH = 1000

interface MessageComposerProps {
  onSend: (body: string) => void
}

export function MessageComposer({ onSend }: MessageComposerProps): ReactElement {
  const [body, setBody] = useState('')
  const trimmedBody = body.trim()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (trimmedBody.length === 0) {
      return
    }

    onSend(trimmedBody)
    setBody('')
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Écrivez un message"
        aria-label="Écrivez un message"
        maxLength={MAX_MESSAGE_LENGTH}
        autoComplete="off"
      />

      <button
        className={styles.send}
        type="submit"
        disabled={trimmedBody.length === 0}
        aria-label="Envoyer le message"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z" fill="currentColor" />
        </svg>
      </button>
    </form>
  )
}

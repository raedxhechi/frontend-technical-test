import type { FormEvent, KeyboardEvent, ReactElement } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import styles from './MessageComposer.module.css'

const MAX_MESSAGE_LENGTH = 1000

interface MessageComposerProps {
  onSend: (body: string) => void
}

export function MessageComposer({ onSend }: MessageComposerProps): ReactElement {
  const [body, setBody] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const trimmedBody = body.trim()

  useLayoutEffect(() => {
    const input = inputRef.current

    if (!input) {
      return
    }

    input.style.height = 'auto'
    const borders = input.offsetHeight - input.clientHeight
    input.style.height = `${input.scrollHeight + borders}px`
  }, [body])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (trimmedBody.length === 0) {
      return
    }

    onSend(trimmedBody)
    setBody('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        className={styles.input}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Écrivez un message"
        aria-label="Écrivez un message"
        maxLength={MAX_MESSAGE_LENGTH}
        rows={1}
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

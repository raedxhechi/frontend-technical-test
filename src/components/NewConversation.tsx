import type { MouseEvent, ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Avatar } from './Avatar'
import { useCreateConversation } from '../hooks/useCreateConversation'
import { useListUsers } from '../hooks/useListUsers'
import type { ConversationWithLastMessage } from '../types/conversation'
import type { User } from '../types/user'
import { convertConversation } from '../utils/convertConversation'
import styles from './NewConversation.module.css'

const MILLISECONDS_PER_SECOND = 1000

interface NewConversationProps {
  conversations: ConversationWithLastMessage[]
  userId: User['id']
}

export function NewConversation({
  conversations,
  userId,
}: NewConversationProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const { data: users, isPending, isError } = useListUsers(isOpen)
  const { mutate: create, isPending: isCreating } = useCreateConversation(userId)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
    }

    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  const existingCorrespondantIds = new Set(
    conversations.map((conversation) => convertConversation(conversation, userId).correspondantId),
  )

  const availableUsers = (users ?? []).filter(
    (user) => user.id !== userId && !existingCorrespondantIds.has(user.id),
  )

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      setIsOpen(false)
    }
  }

  const handleSelect = (user: User) => {
    const loggedUser = (users ?? []).find((candidate) => candidate.id === userId)

    create(
      {
        senderId: userId,
        senderNickname: loggedUser?.nickname ?? '',
        recipientId: user.id,
        recipientNickname: user.nickname,
        lastMessageTimestamp: Math.floor(Date.now() / MILLISECONDS_PER_SECOND),
      },
      {
        onSuccess: (created) => {
          setIsOpen(false)
          router.push(`/conversations/${created.id}`)
        },
      },
    )
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Nouvelle conversation"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M11 5h2v14h-2z M5 11h14v2H5z" fill="currentColor" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onCancel={() => setIsOpen(false)}
        onClick={handleBackdropClick}
        aria-labelledby="new-conversation-title"
      >
        <div className={styles.panel}>
          <header className={styles.header}>
            <h2 id="new-conversation-title" className={styles.title}>
              Démarrer une conversation
            </h2>

            <button
              type="button"
              className={styles.close}
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  d="M6 5 19 18l-1 1L5 6z M18 5l1 1L6 19l-1-1z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </header>

          {isPending && <p className={styles.state}>Chargement des utilisateurs…</p>}
          {isError && <p className={styles.state}>Les utilisateurs n’ont pas pu être chargés.</p>}

          {users && availableUsers.length === 0 && (
            <p className={styles.state}>
              Vous avez déjà une conversation avec tous les utilisateurs.
            </p>
          )}

          {availableUsers.length > 0 && (
            <ul className={styles.list}>
              {availableUsers.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={styles.user}
                    onClick={() => handleSelect(user)}
                    disabled={isCreating}
                  >
                    <Avatar nickname={user.nickname} />
                    <span className={styles.nickname}>{user.nickname}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  )
}

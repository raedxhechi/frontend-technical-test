import { useQueries } from '@tanstack/react-query'
import { useListConversations } from './useListConversations'
import { MessageOperation, getQueryKey as getMessagesQueryKey } from './useListMessages'
import { getMessages } from '../services/messages'
import type { User } from '../types/user'

export function useListConversationsWithLastMessage(userId: User['id']) {
  const {
    data: conversations,
    isPending: areConversationsPending,
    isError,
  } = useListConversations(userId)

  const messageQueries = useQueries({
    queries: (conversations ?? []).map((conversation) => ({
      queryKey: getMessagesQueryKey(MessageOperation.List, conversation.id),
      queryFn: () => getMessages(conversation.id),
    })),
  })

  const isPending = areConversationsPending || messageQueries.some((query) => query.isPending)

  const data = isPending
    ? undefined
    : conversations?.map((conversation, index) => {
        const messages = messageQueries[index]?.data ?? []
        const lastMessageTimestamp = messages.reduce(
          (latest, message) => Math.max(latest, message.timestamp),
          0,
        )

        return lastMessageTimestamp > 0
          ? { ...conversation, lastMessageTimestamp }
          : conversation
      })

  return { data, isPending, isError }
}

import { useQueries } from '@tanstack/react-query'
import { useListConversations } from './useListConversations'
import { MessageOperation, getQueryKey as getMessagesQueryKey } from './useListMessages'
import { getMessages } from '../services/messages'
import type { ConversationWithLastMessage } from '../types/conversation'
import type { Message } from '../types/message'
import type { User } from '../types/user'

export function useListConversationsWithLastMessage(userId: User['id']) {
  const {
    data: conversations,
    isPending: areConversationsPending,
    isError,
    refetch,
  } = useListConversations(userId)

  const messageQueries = useQueries({
    queries: (conversations ?? []).map((conversation) => ({
      queryKey: getMessagesQueryKey(MessageOperation.List, conversation.id),
      queryFn: () => getMessages(conversation.id),
    })),
  })

  const isPending = areConversationsPending || messageQueries.some((query) => query.isPending)

  const data: ConversationWithLastMessage[] | undefined = isPending
    ? undefined
    : conversations?.map((conversation, index) => {
        const messages = messageQueries[index]?.data ?? []
        const lastMessage = messages.reduce<Message | undefined>(
          (latest, message) =>
            latest === undefined || message.timestamp > latest.timestamp ? message : latest,
          undefined,
        )

        return {
          ...conversation,
          lastMessage,
          lastMessageTimestamp: lastMessage?.timestamp ?? conversation.lastMessageTimestamp,
        }
      })

  return { data, isPending, isError, refetch }
}

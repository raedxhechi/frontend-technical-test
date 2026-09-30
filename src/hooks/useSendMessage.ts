import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageOperation, getQueryKey } from './useListMessages'
import { sendMessage } from '../services/messages'
import type { Conversation } from '../types/conversation'
import type { Message } from '../types/message'
import type { User } from '../types/user'

const MILLISECONDS_PER_SECOND = 1000

interface SendMessageContext {
  previousMessages?: Message[]
}

export function useSendMessage(conversationId: Conversation['id'], userId: User['id']) {
  const queryClient = useQueryClient()
  const queryKey = getQueryKey(MessageOperation.List, conversationId)

  return useMutation<Message, Error, string, SendMessageContext>({
    mutationKey: getQueryKey(MessageOperation.Create, conversationId),
    mutationFn: (body) =>
      sendMessage(conversationId, {
        authorId: userId,
        body,
        timestamp: Math.floor(Date.now() / MILLISECONDS_PER_SECOND),
      }),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey })

      const previousMessages = queryClient.getQueryData<Message[]>(queryKey)
      const timestamp = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)

      queryClient.setQueryData<Message[]>(queryKey, (messages = []) => [
        ...messages,
        { id: -Date.now(), conversationId, authorId: userId, timestamp, body },
      ])

      return { previousMessages }
    },

    onError: (_error, _body, context) => {
      queryClient.setQueryData(queryKey, context?.previousMessages)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

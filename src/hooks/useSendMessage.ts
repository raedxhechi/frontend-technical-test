import { useState } from 'react'
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
  const [failedMessages, setFailedMessages] = useState<Message[]>([])

  const mutation = useMutation<Message, Error, Message, SendMessageContext>({
    mutationKey: getQueryKey(MessageOperation.Create, conversationId),
    mutationFn: (message) =>
      sendMessage(conversationId, {
        authorId: message.authorId,
        body: message.body,
        timestamp: message.timestamp,
      }),

    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey })
      const previousMessages = queryClient.getQueryData<Message[]>(queryKey)

      queryClient.setQueryData<Message[]>(queryKey, (messages = []) => [...messages, message])

      return { previousMessages }
    },

    onError: (_error, message, context) => {
      queryClient.setQueryData(queryKey, context?.previousMessages)
      setFailedMessages((failed) => [...failed, message])
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const send = (body: string) =>
    mutation.mutate({
      id: -Date.now(),
      conversationId,
      authorId: userId,
      timestamp: Math.floor(Date.now() / MILLISECONDS_PER_SECOND),
      body,
    })

  const retry = (message: Message) => {
    setFailedMessages((failed) => failed.filter((failedMessage) => failedMessage.id !== message.id))
    mutation.mutate(message)
  }

  return { send, retry, failedMessages }
}

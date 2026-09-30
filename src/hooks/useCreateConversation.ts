import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ConversationOperation, getQueryKey } from './useListConversations'
import { createConversation } from '../services/conversations'
import type { Conversation } from '../types/conversation'
import type { User } from '../types/user'

export function useCreateConversation(userId: User['id']) {
  const queryClient = useQueryClient()
  const queryKey = getQueryKey(ConversationOperation.List, userId)

  return useMutation({
    mutationKey: getQueryKey(ConversationOperation.Create, userId),
    mutationFn: (conversation: Omit<Conversation, 'id'>) =>
      createConversation(userId, conversation),

    onSuccess: (created) => {
      queryClient.setQueryData<Conversation[]>(queryKey, (conversations = []) => [
        ...conversations,
        created,
      ])
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import { getConversations } from '../services/conversations'
import type { User } from '../types/user'

export enum ConversationOperation {
  List = 'list',
  Create = 'create',
}
export const getQueryKey = (
  operation: ConversationOperation,
  userId: User['id'],
) => ['conversations', operation, userId] as const

export function useListConversations(userId: User['id']) {
  return useQuery({
    queryKey: getQueryKey(ConversationOperation.List, userId),
    queryFn: () => getConversations(userId),
  })
}

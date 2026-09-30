import { skipToken, useQuery } from '@tanstack/react-query'
import { getMessages } from '../services/messages'
import type { Conversation } from '../types/conversation'

export enum MessageOperation {
  List = 'list',
}

export const getQueryKey = (
  operation: MessageOperation,
  conversationId?: Conversation['id'],
) => ['messages', operation, conversationId] as const


export function useListMessages(conversationId?: Conversation['id']) {
  return useQuery({
    queryKey: getQueryKey(MessageOperation.List, conversationId),
    queryFn:
      conversationId === undefined ? skipToken : () => getMessages(conversationId),
  })
}

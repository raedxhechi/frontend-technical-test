import type { Conversation } from '../types/conversation'
import type { User } from '../types/user'
import { get, post } from './api'

export function getConversations(userId: User['id']): Promise<Conversation[]> {
  return get<Conversation[]>(`/conversations/${userId}`)
}

export function createConversation(
  userId: User['id'],
  conversation: Omit<Conversation, 'id'>,
): Promise<Conversation> {
  return post<Conversation>(`/conversations/${userId}`, conversation)
}

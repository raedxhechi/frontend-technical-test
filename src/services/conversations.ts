import type { Conversation } from '../types/conversation'
import type { User } from '../types/user'
import { get } from './api'

export function getConversations(userId: User['id']): Promise<Conversation[]> {
  return get<Conversation[]>(`/conversations/${userId}`)
}

import type { Conversation } from '../types/conversation'
import type { Message } from '../types/message'
import { get } from './api'


export function getMessages(conversationId: Conversation['id']): Promise<Message[]> {
  return get<Message[]>(`/messages/${conversationId}`)
}

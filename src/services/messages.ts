import type { Conversation } from '../types/conversation'
import type { Message } from '../types/message'
import { get, post } from './api'


export function getMessages(conversationId: Conversation['id']): Promise<Message[]> {
  return get<Message[]>(`/messages/${conversationId}`)
}

export function sendMessage(
  conversationId: Conversation['id'],
  message: Pick<Message, 'authorId' | 'body' | 'timestamp'>,
): Promise<Message> {
  return post<Message>(`/messages/${conversationId}`, { conversationId, ...message })
}

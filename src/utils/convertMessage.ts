import type { Message, MessageSummary } from '../types/message'
import type { User } from '../types/user'
import { formatMessageTime } from './formatMessageTime'

export function convertMessage(message: Message, userId: User['id']): MessageSummary {
  return {
    id: message.id,
    body: message.body,
    time: formatMessageTime(message.timestamp),
    isFromLoggedUser: message.authorId === userId,
  }
}

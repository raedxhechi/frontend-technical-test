import type { Conversation, ConversationSummary } from '../types/conversation'
import type { User } from '../types/user'
import { formatConversationDate } from './formatConversationDate'

export function convertConversation(
  conversation: Conversation,
  userId: User['id'],
): ConversationSummary {
  const userIsSender = conversation.senderId === userId

  return {
    id: conversation.id,
    correspondantId: userIsSender ? conversation.recipientId : conversation.senderId,
    correspondantNickname: userIsSender
      ? conversation.recipientNickname
      : conversation.senderNickname,
    lastMessageDate: formatConversationDate(conversation.lastMessageTimestamp),
  }
}

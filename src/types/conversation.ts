import type { Message } from './message'

export interface Conversation {
  id: number
  recipientId: number
  recipientNickname: string
  senderId: number
  senderNickname: string,
  lastMessageTimestamp: number,
}

export interface ConversationWithLastMessage extends Conversation {
  lastMessage?: Message
}

export interface ConversationSummary {
  id: number
  correspondantId: number
  correspondantNickname: string
  lastMessageDate: string
  lastMessage?: string
  isLastMessageFromLoggedUser: boolean
}

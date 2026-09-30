export interface Conversation {
  id: number
  recipientId: number
  recipientNickname: string
  senderId: number
  senderNickname: string,
  lastMessageTimestamp: number,
}

export interface ConversationSummary {
  id: number
  correspondantId: number
  correspondantNickname: string
  lastMessageDate: string
}

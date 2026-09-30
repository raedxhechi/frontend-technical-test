export interface Message {
  id: number
  conversationId: number
  authorId: number
  timestamp: number
  body: string
}

export interface MessageSummary {
  id: number
  body: string
  time: string
  isFromLoggedUser: boolean
}

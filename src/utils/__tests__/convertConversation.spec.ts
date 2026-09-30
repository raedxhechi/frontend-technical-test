import { convertConversation } from '../convertConversation'
import type { ConversationWithLastMessage } from '../../types/conversation'

const conversation: ConversationWithLastMessage = {
  id: 1,
  senderId: 1,
  senderNickname: 'Thibaut',
  recipientId: 2,
  recipientNickname: 'Jeremie',
  lastMessageTimestamp: 1625637849,
}

describe('convertConversation', () => {
  it('should use the recipient when the user is the sender', () => {
    expect(convertConversation(conversation, 1)).toMatchObject({
      id: 1,
      correspondantId: 2,
      correspondantNickname: 'Jeremie',
    })
  })

  it('should use the sender when the user is the recipient', () => {
    expect(convertConversation(conversation, 2)).toMatchObject({
      id: 1,
      correspondantId: 1,
      correspondantNickname: 'Thibaut',
    })
  })

  it('should expose no preview when the conversation has no message', () => {
    expect(convertConversation(conversation, 1)).toMatchObject({
      lastMessage: undefined,
      isLastMessageFromLoggedUser: false,
    })
  })

  it('should expose the last message and who wrote it', () => {
    const withLastMessage: ConversationWithLastMessage = {
      ...conversation,
      lastMessage: {
        id: 9,
        conversationId: 1,
        authorId: 1,
        timestamp: 1625637849,
        body: 'Bonjour',
      },
    }

    expect(convertConversation(withLastMessage, 1)).toMatchObject({
      lastMessage: 'Bonjour',
      isLastMessageFromLoggedUser: true,
    })

    expect(convertConversation(withLastMessage, 2)).toMatchObject({
      lastMessage: 'Bonjour',
      isLastMessageFromLoggedUser: false,
    })
  })
})

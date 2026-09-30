import { convertConversation } from '../convertConversation'
import type { Conversation } from '../../types/conversation'

const conversation: Conversation = {
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
})

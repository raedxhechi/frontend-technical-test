import { convertMessage } from '../convertMessage'
import type { Message } from '../../types/message'

const message: Message = {
  id: 1,
  conversationId: 1,
  authorId: 1,
  timestamp: 1625637849,
  body: 'Bonjour',
}

describe('convertMessage', () => {
  it('should mark a message written by the logged user', () => {
    expect(convertMessage(message, 1)).toMatchObject({
      body: 'Bonjour',
      isFromLoggedUser: true,
      isPending: false,
    })
  })

  it('should mark a message written by the correspondant', () => {
    expect(convertMessage(message, 2)).toMatchObject({ isFromLoggedUser: false })
  })

  it('should treat a negative id as a message still being sent', () => {
    expect(convertMessage({ ...message, id: -1 }, 1)).toMatchObject({ isPending: true })
  })
})

import { createConversation } from '../conversations'

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

const conversation = {
  senderId: 1,
  senderNickname: 'Thibaut',
  recipientId: 5,
  recipientNickname: 'Jhon',
  lastMessageTimestamp: 1790000000,
}

describe('createConversation', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should post the whole conversation, not only the recipient', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 6 }) })

    await createConversation(1, conversation)

    const [url, init] = mockFetch.mock.calls[0]

    expect(url).toContain('/conversations/1')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual(conversation)
  })

  it('should return the created conversation', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...conversation, id: 6 }),
    })

    await expect(createConversation(1, conversation)).resolves.toMatchObject({ id: 6 })
  })
})

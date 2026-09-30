import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MessageOperation, getQueryKey } from '../useListMessages'
import { useSendMessage } from '../useSendMessage'
import type { Message } from '../../types/message'

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

const CONVERSATION_ID = 1
const USER_ID = 1
const messagesKey = getQueryKey(MessageOperation.List, CONVERSATION_ID)

const existingMessage: Message = {
  id: 1,
  conversationId: CONVERSATION_ID,
  authorId: 2,
  timestamp: 1625637849,
  body: 'Message existant',
}

const setup = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  queryClient.setQueryData<Message[]>(messagesKey, [existingMessage])

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const { result } = renderHook(() => useSendMessage(CONVERSATION_ID, USER_ID), { wrapper })

  return { queryClient, result }
}

describe('useSendMessage', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should send the conversation and author alongside the body', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] })

    const { result } = setup()

    act(() => result.current.send('Bonjour'))

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())

    const [url, init] = mockFetch.mock.calls[0]

    expect(url).toContain(`/messages/${CONVERSATION_ID}`)
    expect(JSON.parse(init.body)).toMatchObject({
      conversationId: CONVERSATION_ID,
      authorId: USER_ID,
      body: 'Bonjour',
    })
  })

  it('should show the message before the server answers', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}))

    const { queryClient, result } = setup()

    act(() => result.current.send('Bonjour'))

    await waitFor(() => {
      expect(queryClient.getQueryData<Message[]>(messagesKey)).toHaveLength(2)
    })

    const [, optimistic] = queryClient.getQueryData<Message[]>(messagesKey) ?? []

    expect(optimistic).toMatchObject({ body: 'Bonjour', authorId: USER_ID })
    expect(optimistic.id).toBeLessThan(0)
    expect(result.current.failedMessages).toHaveLength(0)
  })

  it('should roll the message back and keep it for a retry when sending fails', async () => {
    mockFetch.mockRejectedValue(new Error('network down'))

    const { queryClient, result } = setup()

    act(() => result.current.send('Bonjour'))

    await waitFor(() => expect(result.current.failedMessages).toHaveLength(1))

    expect(result.current.failedMessages[0]).toMatchObject({ body: 'Bonjour' })
    expect(queryClient.getQueryData<Message[]>(messagesKey)).toEqual([existingMessage])
  })

  it('should drop the message from the failed list when a retry is attempted', async () => {
    mockFetch.mockRejectedValue(new Error('network down'))

    const { result } = setup()

    act(() => result.current.send('Bonjour'))
    await waitFor(() => expect(result.current.failedMessages).toHaveLength(1))

    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] })
    const failed = result.current.failedMessages[0]

    act(() => result.current.retry(failed))

    await waitFor(() => expect(result.current.failedMessages).toHaveLength(0))
  })
})

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NewConversation } from '../NewConversation'
import type { ConversationWithLastMessage } from '../../types/conversation'
import type { User } from '../../types/user'

const push = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

const users: User[] = [
  { id: 1, nickname: 'Thibaut', token: 'xxxx' },
  { id: 2, nickname: 'Jeremie', token: 'xxxx' },
  { id: 3, nickname: 'Patrick', token: 'xxxx' },
  { id: 5, nickname: 'Jhon', token: 'xxxx' },
]

const conversations: ConversationWithLastMessage[] = [
  {
    id: 1,
    senderId: 1,
    senderNickname: 'Thibaut',
    recipientId: 2,
    recipientNickname: 'Jeremie',
    lastMessageTimestamp: 1625637849,
  },
  {
    id: 2,
    senderId: 3,
    senderNickname: 'Patrick',
    recipientId: 1,
    recipientNickname: 'Thibaut',
    lastMessageTimestamp: 1620284667,
  },
]

const respondWith = (createdId = 9) =>
  mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => (init?.method === 'POST' ? { id: createdId } : users),
    }),
  )

const renderPicker = (withConversations = conversations) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  render(<NewConversation conversations={withConversations} userId={1} />, { wrapper })
}

const open = () => fireEvent.click(screen.getByRole('button', { name: /Nouvelle conversation/ }))

describe('NewConversation', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    push.mockReset()
    respondWith()
  })

  it('should only offer users the logged user has no conversation with', async () => {
    renderPicker()
    open()

    expect(await screen.findByText('Jhon')).toBeInTheDocument()
    expect(screen.queryByText('Jeremie')).not.toBeInTheDocument()
    expect(screen.queryByText('Patrick')).not.toBeInTheDocument()
    expect(screen.queryByText('Thibaut')).not.toBeInTheDocument()
  })

  it('should say so when every user already has a conversation', async () => {
    renderPicker([
      ...conversations,
      {
        id: 3,
        senderId: 1,
        senderNickname: 'Thibaut',
        recipientId: 5,
        recipientNickname: 'Jhon',
        lastMessageTimestamp: 1620284667,
      },
    ])
    open()

    expect(
      await screen.findByText(/Vous avez déjà une conversation avec tous les utilisateurs/),
    ).toBeInTheDocument()
  })

  it('should create the conversation with both participants and open it', async () => {
    renderPicker()
    open()

    fireEvent.click(await screen.findByRole('button', { name: /Jhon/ }))

    await waitFor(() => expect(push).toHaveBeenCalledWith('/conversations/9'))

    const [, init] = mockFetch.mock.calls.find(([, options]) => options?.method === 'POST') ?? []

    expect(JSON.parse(init.body)).toMatchObject({
      senderId: 1,
      senderNickname: 'Thibaut',
      recipientId: 5,
      recipientNickname: 'Jhon',
    })
  })
})

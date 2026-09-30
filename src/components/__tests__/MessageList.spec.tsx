import { fireEvent, render, screen, within } from '@testing-library/react'
import { MessageList } from '../MessageList'
import type { Message } from '../../types/message'

const toTimestamp = (date: string): number => Math.floor(new Date(date).getTime() / 1000)

const messages: Message[] = [
  {
    id: 2,
    conversationId: 1,
    authorId: 2,
    timestamp: toTimestamp('2021-07-07T10:00:00'),
    body: 'Réponse du correspondant',
  },
  {
    id: 1,
    conversationId: 1,
    authorId: 1,
    timestamp: toTimestamp('2021-07-06T09:00:00'),
    body: 'Premier message',
  },
]

describe('MessageList', () => {
  it('should render messages from the oldest to the newest', () => {
    render(<MessageList messages={messages} userId={1} />)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      expect.stringContaining('Premier message'),
      expect.stringContaining('Réponse du correspondant'),
    ])
  })

  it('should separate messages by day', () => {
    render(<MessageList messages={messages} userId={1} />)

    const days = screen.getAllByRole('region').map((region) => region.getAttribute('aria-label'))

    expect(days).toEqual(['6 juillet 2021', '7 juillet 2021'])
  })

  it('should distinguish messages written by the logged user', () => {
    render(<MessageList messages={messages} userId={1} />)

    const [own, other] = screen.getAllByRole('listitem')

    expect(own).toHaveAttribute('data-own', 'true')
    expect(other).toHaveAttribute('data-own', 'false')
  })

  it('should offer to retry a message that failed to send', () => {
    const onRetry = jest.fn()
    const failed: Message = {
      id: -1,
      conversationId: 1,
      authorId: 1,
      timestamp: toTimestamp('2021-07-07T11:00:00'),
      body: 'Message échoué',
    }

    render(
      <MessageList messages={messages} userId={1} failedMessages={[failed]} onRetry={onRetry} />,
    )

    const item = screen.getByText('Message échoué').closest('li') as HTMLElement

    fireEvent.click(within(item).getByRole('button', { name: /Réessayer/ }))

    expect(onRetry).toHaveBeenCalledWith(failed)
  })

  it('should not show a retry action on messages that were sent', () => {
    render(<MessageList messages={messages} userId={1} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

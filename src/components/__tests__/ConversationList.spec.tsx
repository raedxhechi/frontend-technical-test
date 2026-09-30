import { render, screen } from '@testing-library/react'
import { ConversationList } from '../ConversationList'
import type { Conversation } from '../../types/conversation'

const conversations: Conversation[] = [
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
    senderId: 1,
    senderNickname: 'Thibaut',
    recipientId: 3,
    recipientNickname: 'Patrick',
    lastMessageTimestamp: 1620284667,
  },
  {
    id: 3,
    senderId: 4,
    senderNickname: 'Elodie',
    recipientId: 1,
    recipientNickname: 'Thibaut',
    lastMessageTimestamp: 1625648667,
  },
]

describe('ConversationList', () => {
  it('should order conversations by most recent activity', () => {
    render(<ConversationList conversations={conversations} userId={1} />)

    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/conversations/3',
      '/conversations/1',
      '/conversations/2',
    ])
  })

  it('should name the correspondant of each conversation', () => {
    render(<ConversationList conversations={conversations} userId={1} />)

    expect(screen.getByText('Elodie')).toBeInTheDocument()
    expect(screen.queryByText('Thibaut')).not.toBeInTheDocument()
  })

  it('should mark the selected conversation as current', () => {
    render(
      <ConversationList conversations={conversations} userId={1} selectedConversationId={2} />,
    )

    expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute(
      'href',
      '/conversations/2',
    )
  })
})

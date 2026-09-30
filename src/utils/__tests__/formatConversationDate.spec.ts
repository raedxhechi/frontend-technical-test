import { formatConversationDate } from '../formatConversationDate'

const toTimestamp = (date: string): number => Math.floor(new Date(date).getTime() / 1000)

const now = new Date('2021-07-07T18:00:00')

describe('formatConversationDate', () => {
  it('should return the time for today', () => {
    expect(formatConversationDate(toTimestamp('2021-07-07T14:32:00'), now)).toBe('14:32')
  })

  it('should return "Hier" for yesterday', () => {
    expect(formatConversationDate(toTimestamp('2021-07-06T09:00:00'), now)).toBe('Hier')
  })

  it('should return the day and month within the same year', () => {
    expect(formatConversationDate(toTimestamp('2021-04-24T09:00:00'), now)).toBe('24 avril')
  })

  it('should return the full date for an older year', () => {
    expect(formatConversationDate(toTimestamp('2020-04-24T09:00:00'), now)).toBe('24/04/2020')
  })
})

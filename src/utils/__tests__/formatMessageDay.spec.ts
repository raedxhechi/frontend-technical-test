import { formatMessageDay } from '../formatMessageDay'

const toTimestamp = (date: string): number => Math.floor(new Date(date).getTime() / 1000)

const now = new Date('2021-07-07T18:00:00')

describe('formatMessageDay', () => {
  it('should return "Aujourd’hui" for today', () => {
    expect(formatMessageDay(toTimestamp('2021-07-07T09:00:00'), now)).toBe('Aujourd’hui')
  })

  it('should return "Hier" for yesterday', () => {
    expect(formatMessageDay(toTimestamp('2021-07-06T09:00:00'), now)).toBe('Hier')
  })

  it('should return the day and month within the same year', () => {
    expect(formatMessageDay(toTimestamp('2021-04-24T09:00:00'), now)).toBe('24 avril')
  })

  it('should return the full date for an older year', () => {
    expect(formatMessageDay(toTimestamp('2020-04-24T09:00:00'), now)).toBe('24 avril 2020')
  })
})

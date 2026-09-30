
const LOCALE = 'fr-FR'

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
})

const dayAndMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
})

const fullDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function formatConversationDate(timestamp: number, now: Date = new Date()): string {
  const date = new Date(timestamp * 1000)

  if (isSameDay(date, now)) {
    return timeFormatter.format(date)
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(date, yesterday)) {
    return 'Hier'
  }

  if (date.getFullYear() === now.getFullYear()) {
    return dayAndMonthFormatter.format(date)
  }

  return fullDateFormatter.format(date)
}

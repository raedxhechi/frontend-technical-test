const MILLISECONDS_PER_SECOND = 1000

const dayAndMonthFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
})

const fullDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function formatMessageDay(timestamp: number, now: Date = new Date()): string {
  const date = new Date(timestamp * MILLISECONDS_PER_SECOND)

  if (isSameDay(date, now)) {
    return 'Aujourd’hui'
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

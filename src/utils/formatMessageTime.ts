const MILLISECONDS_PER_SECOND = 1000

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})

export function formatMessageTime(timestamp: number): string {
  return timeFormatter.format(new Date(timestamp * MILLISECONDS_PER_SECOND))
}

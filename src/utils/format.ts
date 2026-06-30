import { pad2 } from './text'

export function formatLocalDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    year: 'numeric',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day} ${normalizeHour(values.hour)}:${values.minute}:${values.second} ${values.timeZoneName}`
}

export function formatTimeLeft(date: Date, now = new Date()) {
  const ms = date.getTime() - now.getTime()
  if (ms <= 0)
    return 'expired'

  const totalMinutes = Math.floor(ms / 60_000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0)
    return `${days}d ${hours}h`

  if (hours > 0)
    return `${hours}h ${minutes}m`

  return `${minutes}m`
}

function normalizeHour(hour: string) {
  return hour === '24' ? '00' : pad2(Number(hour))
}

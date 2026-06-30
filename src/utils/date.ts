export function parseDate(value: unknown) {
  if (typeof value !== 'string' || !value)
    return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

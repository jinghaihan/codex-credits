export function pad2(value: number) {
  return String(value).padStart(2, '0')
}

export function plural(count: number, singular: string, pluralValue: string) {
  return count === 1 ? singular : pluralValue
}

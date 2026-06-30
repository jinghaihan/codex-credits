import type { CodexUsage, Paint, RenderOptions, UsageWindow } from '../types'
import c from 'ansis'
import {
  formatLocalDateTime,
  formatLocalDateTimeWithoutZone,
  formatTimeLeft,
  paintCreditTimeLeft,
  paintUsageLeftPercent,
} from '../utils'

export function renderCodexCredits(data: CodexUsage, options: RenderOptions = {}) {
  const color = options.color ?? true
  const paint = {
    dim: (value: string) => color ? c.dim(value) : value,
    green: (value: string) => color ? c.green(value) : value,
    red: (value: string) => color ? c.red(value) : value,
    yellow: (value: string) => color ? c.yellow(value) : value,
    cyan: (value: string) => color ? c.cyan(value) : value,
  }

  const lines: string[] = []
  const firstCredit = data.credits[0]

  lines.push(`Codex reset credits: ${paint.green(String(data.availableCredits))}`)

  if (firstCredit) {
    lines.push('')
    lines.push('Next expiry')
    lines.push(`  ${paint.dim('at')}    ${paint.red(formatLocalDateTime(firstCredit.expiresAt))}`)
    lines.push(`  ${paint.dim('in')}    ${paintCreditTimeLeft(firstCredit.expiresAt, paint)}`)
  }
  else {
    lines.push('')
    lines.push('No reset credits are available.')
  }

  if (data.credits.length > 0) {
    lines.push('')
    lines.push('All credits')
    data.credits.forEach((credit, index) => {
      const number = String(index + 1).padStart(2, '0')
      const granted = formatLocalDateTimeWithoutZone(credit.grantedAt)
      const expires = formatLocalDateTimeWithoutZone(credit.expiresAt)
      lines.push(`  ${paint.dim(number)}    ${granted}  -  ${expires}`)
    })
  }

  const usage = renderUsage(data, paint)
  if (usage.length > 0) {
    lines.push('')
    lines.push('Usage windows')
    lines.push(...usage)
  }

  return `${lines.join('\n')}\n`
}

function renderUsage(
  data: CodexUsage,
  paint: Paint,
) {
  return [
    renderUsageWindow('5h', data.usage.primary, paint),
    renderUsageWindow('7d', data.usage.secondary, paint),
  ].filter(Boolean)
}

function renderUsageWindow(
  label: string,
  window: UsageWindow | null,
  paint: Paint,
) {
  if (!window)
    return ''

  const percent = window.usedPercent === null
    ? paint.dim('unknown')
    : paintUsageLeftPercent(Math.max(0, Math.round(100 - window.usedPercent)), paint)
  const reset = window.resetsAt ? `    resets in ${paint.cyan(formatTimeLeft(window.resetsAt))}` : ''

  return `  ${paint.dim(label)}    ${percent} left${reset}`
}

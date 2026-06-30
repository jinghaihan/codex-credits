import type { CodexUsage, RenderOptions, UsageWindow } from '../types'
import c from 'ansis'
import { formatLocalDateTime, formatLocalDateTimeWithoutZone, formatTimeLeft } from '../utils'

export function renderCodexCredits(data: CodexUsage, options: RenderOptions = {}) {
  const color = options.color ?? true
  const paint = {
    dim: (value: string) => color ? c.dim(value) : value,
    green: (value: string) => color ? c.green(value) : value,
    red: (value: string) => color ? c.red(value) : value,
    yellow: (value: string) => color ? c.yellow(value) : value,
  }

  const lines: string[] = []
  const firstCredit = data.credits[0]

  lines.push(`Codex reset credits: ${paint.green(String(data.availableCredits))}`)

  if (firstCredit) {
    lines.push('')
    lines.push('Next expiry')
    lines.push(`  ${paint.dim('at')}    ${paint.red(formatLocalDateTime(firstCredit.expiresAt))}`)
    lines.push(`  ${paint.dim('in')}    ${formatTimeLeft(firstCredit.expiresAt)}`)
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

  const usage = renderUsage(data, paint.yellow, paint.dim)
  if (usage.length > 0) {
    lines.push('')
    lines.push('Usage windows')
    lines.push(...usage)
  }

  return `${lines.join('\n')}\n`
}

function renderUsage(
  data: CodexUsage,
  yellow: (value: string) => string,
  dim: (value: string) => string,
) {
  return [
    renderUsageWindow('5h', data.usage.primary, yellow, dim),
    renderUsageWindow('7d', data.usage.secondary, yellow, dim),
  ].filter(Boolean)
}

function renderUsageWindow(
  label: string,
  window: UsageWindow | null,
  yellow: (value: string) => string,
  dim: (value: string) => string,
) {
  if (!window)
    return ''

  const percent = window.usedPercent === null ? 'unknown' : `${Math.max(0, Math.round(100 - window.usedPercent))}%`
  const reset = window.resetsAt ? `    resets in ${yellow(formatTimeLeft(window.resetsAt))}` : ''

  return `  ${dim(label)}    ${yellow(percent)} left${reset}`
}

import type { CodexUsage, RenderOptions, UsageWindow } from '../types'
import c from 'ansis'
import { formatLocalDateTime, formatTimeLeft, plural } from '../utils'

export function renderCodexCredits(data: CodexUsage, options: RenderOptions = {}) {
  const color = options.color ?? true
  const paint = {
    cyan: (value: string) => color ? c.cyan(value) : value,
    red: (value: string) => color ? c.red(value) : value,
    yellow: (value: string) => color ? c.yellow(value) : value,
  }

  const lines: string[] = []
  const firstCredit = data.credits[0]

  lines.push(`Codex has ${paint.yellow(String(data.availableCredits))} reset ${plural(data.availableCredits, 'credit', 'credits')}.`)
  lines.push('')

  if (firstCredit) {
    lines.push(`Next one expires ${paint.red(formatLocalDateTime(firstCredit.expiresAt))}`)
    lines.push(`${formatTimeLeft(firstCredit.expiresAt)} left`)
  }
  else {
    lines.push('No reset credits are available.')
  }

  if (data.credits.length > 0) {
    lines.push('')
    data.credits.forEach((credit, index) => {
      const number = String(index + 1).padStart(2, '0')
      const granted = formatLocalDateTime(credit.grantedAt)
      const expires = paint.cyan(formatLocalDateTime(credit.expiresAt))
      lines.push(`${number}  ${granted} -> ${expires}`)
    })
  }

  const usage = renderUsage(data, paint.yellow)
  if (usage) {
    lines.push('')
    lines.push(usage)
  }

  return `${lines.join('\n')}\n`
}

function renderUsage(data: CodexUsage, yellow: (value: string) => string) {
  const parts = [
    renderUsageWindow('5h', data.usage.primary, yellow),
    renderUsageWindow('7d', data.usage.secondary, yellow),
  ].filter(Boolean)

  return parts.length > 0 ? `Usage: ${parts.join(', ')}` : ''
}

function renderUsageWindow(label: string, window: UsageWindow | null, yellow: (value: string) => string) {
  if (!window)
    return ''

  const percent = window.usedPercent === null ? 'unknown' : `${Math.max(0, Math.round(100 - window.usedPercent))}%`
  const reset = window.resetsAt ? `, resets in ${yellow(formatTimeLeft(window.resetsAt))}` : ''

  return `${label} ${yellow(percent)} left${reset}`
}

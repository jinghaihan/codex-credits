import type { CodexCredit, CodexUsage, ResetCreditsResponse, UsageResponse } from '../types'
import { parseDate } from './date'

export function normalizeCodexUsage(creditsData: ResetCreditsResponse, usageData: UsageResponse): CodexUsage {
  const credits = Array.isArray(creditsData.credits)
    ? creditsData.credits
        .map(normalizeCredit)
        .filter((credit): credit is CodexCredit => Boolean(credit))
        .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime())
    : []

  return {
    availableCredits: Number.parseInt(String(creditsData.available_count ?? credits.length), 10) || 0,
    credits,
    usage: normalizeUsage(usageData),
  }
}

function normalizeCredit(credit: NonNullable<ResetCreditsResponse['credits']>[number]): CodexCredit | null {
  const grantedAt = parseDate(credit.granted_at)
  const expiresAt = parseDate(credit.expires_at)

  if (!grantedAt || !expiresAt)
    return null

  return {
    expiresAt,
    grantedAt,
    status: credit.status,
  }
}

function normalizeUsage(data: UsageResponse): CodexUsage['usage'] {
  const rateLimit = data.rate_limit ?? data.rateLimits ?? {}

  return {
    primary: normalizeWindow(rateLimit.primary_window ?? rateLimit.primary),
    secondary: normalizeWindow(rateLimit.secondary_window ?? rateLimit.secondary),
  }
}

function normalizeWindow(value: unknown) {
  if (!value || typeof value !== 'object')
    return null

  const record = value as Record<string, unknown>
  const usedPercent = record.used_percent ?? record.usedPercent
  const resetAfterSeconds = record.reset_after_seconds
  let resetsAt = record.reset_at ?? record.resetsAt ?? record.resets_at

  if (resetsAt === undefined && resetAfterSeconds !== undefined)
    resetsAt = Math.floor(Date.now() / 1000) + Number(resetAfterSeconds)

  if (usedPercent === undefined && resetsAt === undefined)
    return null

  return {
    resetsAt: resetsAt === undefined || resetsAt === null ? null : new Date(Number(resetsAt) * 1000),
    usedPercent: usedPercent === undefined || usedPercent === null ? null : Number(usedPercent),
  }
}

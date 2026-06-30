import { describe, expect, it } from 'vitest'
import { formatLocalDateTime, formatTimeLeft, normalizeCodexUsage } from '../src'

describe('formatLocalDateTime', () => {
  it('uses local 24-hour time with seconds', () => {
    const formatted = formatLocalDateTime(new Date('2026-07-12T02:09:26.000Z'))

    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} .+$/)
    expect(formatted).not.toMatch(/\b(?:AM|PM)\b/)
  })
})

describe('formatTimeLeft', () => {
  it('formats days and hours', () => {
    expect(formatTimeLeft(
      new Date('2026-07-12T02:09:26.000Z'),
      new Date('2026-06-30T12:41:18.000Z'),
    )).toBe('11d 13h')
  })
})

describe('normalizeCodexUsage', () => {
  it('sorts credits by expiration and normalizes usage windows', () => {
    const data = normalizeCodexUsage(
      {
        available_count: 2,
        credits: [
          {
            expires_at: '2026-07-18T00:37:46.000Z',
            granted_at: '2026-06-18T00:37:46.000Z',
          },
          {
            expires_at: '2026-07-12T02:09:26.000Z',
            granted_at: '2026-06-12T02:09:26.000Z',
          },
        ],
      },
      {
        rate_limit: {
          primary_window: {
            reset_at: 1782823278,
            used_percent: 3,
          },
          secondary_window: {
            reset_at: 1783399278,
            used_percent: 20,
          },
        },
      },
    )

    expect(data.availableCredits).toBe(2)
    expect(data.credits.map(credit => credit.expiresAt.toISOString())).toEqual([
      '2026-07-12T02:09:26.000Z',
      '2026-07-18T00:37:46.000Z',
    ])
    expect(data.usage.primary?.usedPercent).toBe(3)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatLocalDateTime, formatTimeLeft, normalizeCodexUsage, renderCodexCredits } from '../src'

describe('formatLocalDateTime', () => {
  it('uses local 24-hour time with seconds', () => {
    expect(formatLocalDateTime(new Date('2026-07-12T02:09:26.000Z'))).toMatch(/2026-07-12 10:09:26 .+/)
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

describe('renderCodexCredits', () => {
  const resetIn4h36m = Math.floor(new Date('2026-06-30T17:17:18.000Z').getTime() / 1000)
  const resetIn6d13h = Math.floor(new Date('2026-07-07T01:41:18.000Z').getTime() / 1000)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-30T12:41:18.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the compact output shape', () => {
    const data = normalizeCodexUsage(
      {
        available_count: 3,
        credits: [
          {
            expires_at: '2026-07-12T02:09:26.000Z',
            granted_at: '2026-06-12T02:09:26.000Z',
          },
          {
            expires_at: '2026-07-18T00:37:46.000Z',
            granted_at: '2026-06-18T00:37:46.000Z',
          },
          {
            expires_at: '2026-07-26T23:48:09.000Z',
            granted_at: '2026-06-26T23:48:09.000Z',
          },
        ],
      },
      {
        rate_limit: {
          primary_window: {
            reset_at: resetIn4h36m,
            used_percent: 3,
          },
          secondary_window: {
            reset_at: resetIn6d13h,
            used_percent: 20,
          },
        },
      },
    )

    expect(renderCodexCredits(data, { color: false })).toMatchInlineSnapshot(`
      "Codex reset credits: 3

      Next expiry
        at    2026-07-12 10:09:26 GMT+8
        in    11d 13h

      All credits
        01    2026-06-12 10:09:26  -  2026-07-12 10:09:26
        02    2026-06-18 08:37:46  -  2026-07-18 08:37:46
        03    2026-06-27 07:48:09  -  2026-07-27 07:48:09

      Usage windows
        5h    97% left    resets in 4h 36m
        7d    80% left    resets in 6d 13h
      "
    `)
  })
})

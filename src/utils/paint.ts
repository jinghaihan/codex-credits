import type { Paint } from '../types'
import {
  CREDIT_EXPIRY_GREEN_DAYS,
  CREDIT_EXPIRY_RED_DAYS,
  DAY_MS,
  USAGE_LEFT_RED_PERCENT,
  USAGE_LEFT_YELLOW_PERCENT,
} from '../constants'
import { formatTimeLeft } from './format'

export function paintCreditTimeLeft(date: Date, paint: Paint) {
  const now = new Date()
  const text = formatTimeLeft(date, now)
  const daysLeft = (date.getTime() - now.getTime()) / DAY_MS

  if (daysLeft < CREDIT_EXPIRY_RED_DAYS)
    return paint.red(text)
  if (daysLeft > CREDIT_EXPIRY_GREEN_DAYS)
    return paint.green(text)

  return paint.yellow(text)
}

export function paintUsageLeftPercent(leftPercent: number, paint: Paint) {
  const percent = `${leftPercent}%`

  if (leftPercent <= USAGE_LEFT_RED_PERCENT)
    return paint.red(percent)
  if (leftPercent <= USAGE_LEFT_YELLOW_PERCENT)
    return paint.yellow(percent)

  return paint.green(percent)
}

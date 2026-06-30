import pkg from '../package.json'

export const NAME = pkg.name

export const VERSION = pkg.version

export const BASE_URL = 'https://chatgpt.com/backend-api'

export const CREDITS_PATH = '/wham/rate-limit-reset-credits'

export const USAGE_PATH = '/wham/usage'

export const DEFAULT_AUTH_PATH = '~/.codex/auth.json'

export const REQUEST_TIMEOUT_MS = 15_000

export const USAGE_LEFT_RED_PERCENT = 20

export const USAGE_LEFT_YELLOW_PERCENT = 50

export const CREDIT_EXPIRY_RED_DAYS = 7

export const CREDIT_EXPIRY_GREEN_DAYS = 15

export const DAY_MS = 86_400_000

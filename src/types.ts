export interface CommandOptions {
  auth?: string
}

export interface AuthFile {
  tokens?: {
    access_token?: string
    account_id?: string
  }
}

export interface ResetCreditsResponse {
  available_count?: number | string
  credits?: Array<{
    expires_at?: string
    granted_at?: string
    status?: string
  }>
}

export interface UsageResponse {
  rate_limit?: UsageRateLimit
  rateLimits?: UsageRateLimit
}

export interface UsageRateLimit {
  primary?: unknown
  primary_window?: unknown
  secondary?: unknown
  secondary_window?: unknown
}

export interface CodexCredit {
  expiresAt: Date
  grantedAt: Date
  status?: string
}

export interface UsageWindow {
  resetsAt: Date | null
  usedPercent: number | null
}

export interface CodexUsage {
  availableCredits: number
  credits: CodexCredit[]
  usage: {
    primary: UsageWindow | null
    secondary: UsageWindow | null
  }
}

export interface RenderOptions {
  color?: boolean
}

export interface Paint {
  dim: (value: string) => string
  green: (value: string) => string
  red: (value: string) => string
  yellow: (value: string) => string
  cyan: (value: string) => string
}

export type FetchJson = (path: string, auth: AuthFile) => Promise<unknown>

import type { AuthFile, FetchJson, ResetCreditsResponse, UsageResponse } from '../types'
import process from 'node:process'
import { fetch, ProxyAgent } from 'undici'
import { BASE_URL, CREDITS_PATH, REQUEST_TIMEOUT_MS, USAGE_PATH } from '../constants'
import { CodexCreditsError } from '../errors'
import { getProxyUrl, normalizeCodexUsage } from '../utils'
import { loadAuth } from './auth'

export function createFetch(env: NodeJS.ProcessEnv = process.env): FetchJson {
  const proxyUrl = getProxyUrl(env)
  const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined

  return async function fetchJson(path: string, auth: AuthFile) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        dispatcher,
        headers: buildHeaders(auth),
        signal: controller.signal,
      })

      if (response.status === 401)
        throw new CodexCreditsError('Authentication failed. Run Codex login again or pass a valid auth file with --auth <path>.')

      if (!response.ok)
        throw new CodexCreditsError(`Request failed with HTTP ${response.status}.`)

      return await response.json() as unknown
    }
    catch (error) {
      if (error instanceof CodexCreditsError)
        throw error

      throw new CodexCreditsError('Network request failed. Check your proxy or network connection.')
    }
    finally {
      clearTimeout(timeout)
    }
  }
}

export async function getCodexCredits(authPath?: string, fetchJson = createFetch()) {
  const auth = await loadAuth(authPath)
  const [credits, usage] = await Promise.all([
    fetchJson(CREDITS_PATH, auth) as Promise<ResetCreditsResponse>,
    fetchJson(USAGE_PATH, auth) as Promise<UsageResponse>,
  ])

  return normalizeCodexUsage(credits, usage)
}

function buildHeaders(auth: AuthFile) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${auth.tokens?.access_token}`,
  }
}

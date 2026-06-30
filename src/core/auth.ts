import type { AuthFile } from '../types'
import { readFile } from 'node:fs/promises'
import { CodexCreditsError, isNodeError } from '../errors'
import { expandPath } from '../utils'

export async function loadAuth(authPath?: string): Promise<AuthFile> {
  const resolvedPath = expandPath(authPath)

  let raw: string
  try {
    raw = await readFile(resolvedPath, 'utf8')
  }
  catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT')
      throw new CodexCreditsError(`Auth file not found: ${resolvedPath}`)

    throw new CodexCreditsError(`Unable to read auth file: ${resolvedPath}`)
  }

  try {
    const auth = JSON.parse(raw) as AuthFile
    if (!auth.tokens?.access_token)
      throw new CodexCreditsError(`No access token found in auth file: ${resolvedPath}`)

    return auth
  }
  catch (error) {
    if (error instanceof CodexCreditsError)
      throw error

    throw new CodexCreditsError(`Unable to parse auth file: ${resolvedPath}`)
  }
}

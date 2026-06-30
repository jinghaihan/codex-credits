import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { DEFAULT_AUTH_PATH } from '../constants'

export function expandPath(path = DEFAULT_AUTH_PATH) {
  if (path === '~')
    return homedir()

  if (path.startsWith('~/'))
    return resolve(homedir(), path.slice(2))

  return resolve(path)
}

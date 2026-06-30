import process from 'node:process'

export function getProxyUrl(env: NodeJS.ProcessEnv = process.env) {
  return env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy || env.ALL_PROXY || env.all_proxy
}

import type { CommandOptions } from './types'
import process from 'node:process'
import { cac } from 'cac'
import { NAME, VERSION } from './constants'
import { getCodexCredits } from './core/api'
import { renderCodexCredits } from './core/render'
import { CodexCreditsError } from './errors'

async function main() {
  const cli = cac(NAME)

  cli.option('--auth <path>', 'Path to Codex auth JSON')

  cli
    .command('', 'Check Codex reset credits and usage windows')
    .action(async (options: CommandOptions) => {
      const data = await getCodexCredits(options.auth)

      process.stdout.write(renderCodexCredits(data))
    })

  cli.help()
  cli.version(VERSION)

  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}

try {
  await main()
}
catch (error) {
  if (error instanceof CodexCreditsError) {
    console.error(`error: ${error.message}`)
    process.exit(error.exitCode)
  }

  if (error instanceof Error) {
    console.error(`error: ${error.message}`)
    process.exit(1)
  }

  console.error('error: unexpected failure')
  process.exit(1)
}

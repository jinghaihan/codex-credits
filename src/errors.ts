export class CodexCreditsError extends Error {
  constructor(message: string, public readonly exitCode = 1) {
    super(message)
    this.name = 'CodexCreditsError'
  }
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}

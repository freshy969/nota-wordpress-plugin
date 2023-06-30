/* eslint-disable no-console -- pass through logger methods */
interface Logger {
  error: typeof console.error
  log: typeof console.log
}
export const logger: Logger = {
  error: console.error,
  log: console.log,
}

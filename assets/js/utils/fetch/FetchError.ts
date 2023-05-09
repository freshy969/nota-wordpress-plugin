export class FetchError extends Error {
  public status: number
  public data?: unknown
  constructor(status: number, statusText: string, response?: unknown) {
    super(statusText)
    Object.setPrototypeOf(this, FetchError.prototype)
    this.status = status
    this.data = response
  }
}

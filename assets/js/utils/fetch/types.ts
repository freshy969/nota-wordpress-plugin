export interface RequestOptions {
  data?: Record<string, unknown> | string | FormData | object
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
  /*** Defaults to the current host */
  baseUrl?: string
}

export interface FetchResponse<T> {
  data: T
  status: number
  statusText: string
}

type FnWithArgs<TResponse, TArgs> = (args: TArgs) => Promise<TResponse>
type FnWithOutArgs<TResponse> = () => Promise<TResponse>
export type ReturnFn<TResponse, TArgs> = TArgs extends undefined
  ? FnWithOutArgs<TResponse>
  : FnWithArgs<TResponse, TArgs>

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

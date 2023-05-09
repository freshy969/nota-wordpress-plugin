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

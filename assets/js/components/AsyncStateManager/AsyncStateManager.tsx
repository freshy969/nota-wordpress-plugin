import { Notice } from 'assets/js/components/Notice/Notice'

const defaultErrorMessage = 'Unknown error occurred.'
const getErrorMessage = (errors: unknown) => {
  // errors are untyped so we need to narrow them down into something we can trust
  // it's a mouthful, but each of these is required to ensure that we have a Fetch error
  // that conforms to our Nota Error structure
  if (
    errors === null ||
    typeof errors !== 'object' ||
    !('data' in errors) ||
    errors.data === null ||
    typeof errors.data !== 'object' ||
    !('data' in errors.data)
  )
    return defaultErrorMessage

  // WP encodes errors as such:
  // { data: { code: string; message: string }[] }
  // so we want to find any errors that are Nota specific
  const errorData = errors?.data?.data || []
  if (!Array.isArray(errorData)) return null
  const notaError = errorData.find(
    (error): error is { message: string } =>
      // this ensures it's a nota_error
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'nota_error' &&
      // this ensures our nota error has a message
      'message' in error &&
      typeof error.message === 'string',
  )
  return notaError?.message || defaultErrorMessage
}

interface Props {
  retry: () => void
  isLoading: boolean
  error?: unknown
  children: React.ReactNode
}

export function AsyncStateManager({
  isLoading,
  error,
  retry,
  children,
}: Props) {
  return (
    <div>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          {!!error ? (
            <Notice level="error">
              <div className="ntw-flex ntw-justify-between ntw-gap-16px">
                <div>{getErrorMessage(error)}</div>
                <button
                  onClick={retry}
                  className="ntw-font-bold ntw-uppercase ntw-tracking-wider"
                >
                  Retry
                </button>
              </div>
            </Notice>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
}

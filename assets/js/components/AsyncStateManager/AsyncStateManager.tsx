import { Button } from '@wordpress/components'

interface Props {
  retry: () => void
  isLoading: boolean
  hasError: boolean
  children: React.ReactNode
}

export function AsyncStateManager({
  isLoading,
  hasError,
  retry,
  children,
}: Props) {
  return (
    <div>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          {hasError ? (
            <div>
              There was an error.{' '}
              <Button variant="link" onClick={retry}>
                Retry
              </Button>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
}

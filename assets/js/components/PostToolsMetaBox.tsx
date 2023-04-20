import { useGetPostSEOData } from 'assets/js/application/useGetPostSEOData'
import { nlpService } from 'assets/js/services/nlpService/nlpService'
import { useSelect } from '@wordpress/data'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from '@wordpress/element'
import { Button } from 'assets/js/components/Button'

// Where does WP keep these?
interface WPDataCoreEditor {
  getEditedPostContent: () => string
}

enum Screen {
  Initial,
  Results,
}

const PostToolsMetaBoxInner = () => {
  const [screen, setScreen] = useState(Screen.Initial)
  const postHTML = useSelect(
    (select) =>
      (select('core/editor') as WPDataCoreEditor).getEditedPostContent(),
    [],
  )
  const getPostSeoData = useGetPostSEOData({
    nlpService,
  })

  return (
    <div>
      {screen === Screen.Initial && (
        <Button
          onClick={() => {
            setScreen(Screen.Results)
            getPostSeoData.run({
              postHTML,
            })
          }}
        >
          Optimise with Nota
        </Button>
      )}
      {screen === Screen.Results && (
        <div>
          <div className="ntw-mb-8">
            <Button onClick={() => setScreen(Screen.Initial)}>
              Start over
            </Button>
          </div>
          <div className="ntw-space-y-8">
            <div>
              <h3 className="ntw-mb-2 ntw-mt-0 ntw-text-lg ntw-font-bold">
                Summary
              </h3>
              {getPostSeoData.summary.isLoading ? (
                'Loading...'
              ) : (
                <div>
                  {getPostSeoData.summary.isError ? (
                    <div>There was an error</div>
                  ) : (
                    <div>
                      {getPostSeoData.summary.data?.summary || 'No summary'}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <h3 className="ntw-mb-2 ntw-mt-0 ntw-text-lg ntw-font-bold">
                Headlines
              </h3>
              {getPostSeoData.headlines.isLoading ? (
                'Loading...'
              ) : (
                <div>
                  {getPostSeoData.headlines.isError ? (
                    <div>There was an error</div>
                  ) : (
                    <div>
                      {(getPostSeoData.headlines.data?.headlines || []).map(
                        (headline) => (
                          <div key={headline}>{headline}</div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const queryClient = new QueryClient()

export const PostToolsMetaBox = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PostToolsMetaBoxInner />
    </QueryClientProvider>
  )
}

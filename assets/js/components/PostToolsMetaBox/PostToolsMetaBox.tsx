import { useGetPostSEOData } from 'assets/js/application/useGetPostSEOData'
import { nlpService } from 'assets/js/services/nlpService/nlpService'
import { useSelect } from '@wordpress/data'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from '@wordpress/element'
import { TextOptionList } from 'assets/js/components/TextOptionList/TextOptionList'
import { Button } from '@wordpress/components'
import { useEditPostTitle } from 'assets/js/application/useEditPostTitle'

// Where does WP keep these?
interface WPDataCoreEditor {
  getEditedPostContent: () => string
}

enum Screen {
  Initial,
  Results,
}

// this needs to be declared outside of the component
// or memoized. Otherwise it'll trigger infinite re-renders within useGetPostSEOData
const components = {
  headlines: true,
  summary: true,
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
    components,
  })
  const editPostTitle = useEditPostTitle()

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
          variant="primary"
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
              <TextOptionList
                title="Headlines"
                isLoading={getPostSeoData.headlines.isLoading}
                hasError={getPostSeoData.headlines.isError}
                options={getPostSeoData.headlines.data}
                onSelect={editPostTitle}
                updateOptions={getPostSeoData.headlines.update}
                onRefresh={() =>
                  getPostSeoData.headlines.refresh({
                    postHTML,
                  })
                }
              />
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

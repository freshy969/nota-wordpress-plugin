import { useGetPostSEOData } from 'assets/js/application/useGetPostSEOData'
import { notaService } from 'assets/js/services/notaService/notaService'
import { useSelect } from '@wordpress/data'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from '@wordpress/element'
import { TextOptionList } from 'assets/js/components/TextOptionList/TextOptionList'
import { Button } from '@wordpress/components'
import { useEditPostTitle } from 'assets/js/application/useEditPostTitle'
import { useAddTaxonomy } from 'assets/js/application/useAddTaxonomy'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'
import { useEditMetadata } from 'assets/js/application/useEditMetadata'
import { ScreenInitial } from 'assets/js/components/PostToolsMetaBox/ScreenInitial'

enum Screen {
  Initial,
  Results,
}
const useWpSelect = useSelect as WordPress.useSelect

// this needs to be declared outside of the component
// or memoized. Otherwise it'll trigger infinite re-renders within useGetPostSEOData
const components = {
  headlines: true,
  metaDescription: window.notaTools.components.meta_description,
  metaTitle: window.notaTools.components.meta_title,
  summary: false,
  tags: window.notaTools.components.tags,
}

const PostToolsMetaBoxInner = () => {
  const [screen, setScreen] = useState(Screen.Initial)
  const postHTML = useWpSelect(
    (select) => select('core/editor').getEditedPostContent(),
    [],
  )
  const getPostSeoData = useGetPostSEOData({
    notaService,
    components,
  })
  const editPostTitle = useEditPostTitle()
  const addTag = useAddTaxonomy({
    taxonomy: 'post_tag',
    wpService: wordPressService,
  })
  const { editMetaDescription, editMetaTitle } = useEditMetadata()

  return (
    <div>
      {screen === Screen.Initial && (
        <ScreenInitial
          onSubmit={() => {
            setScreen(Screen.Results)
            getPostSeoData.run({
              postHTML,
            })
          }}
        />
      )}
      {screen === Screen.Results && (
        <div>
          <div className="ntw-mb-8">
            <Button onClick={() => setScreen(Screen.Initial)} variant="link">
              Start over
            </Button>
          </div>
          <div className="ntw-space-y-8">
            {components.summary && (
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
            )}

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

            {components.tags && (
              <TextOptionList
                title="Tags"
                isLoading={getPostSeoData.tags.isLoading}
                hasError={getPostSeoData.tags.isError}
                options={getPostSeoData.tags.data}
                onSelect={addTag}
                updateOptions={getPostSeoData.tags.update}
                onRefresh={() =>
                  getPostSeoData.tags.refresh({
                    postHTML,
                  })
                }
              />
            )}

            <TextOptionList
              title="Meta Description"
              isLoading={getPostSeoData.metaDescriptions.isLoading}
              hasError={getPostSeoData.metaDescriptions.isError}
              options={getPostSeoData.metaDescriptions.data}
              onSelect={editMetaDescription}
              updateOptions={getPostSeoData.metaDescriptions.update}
              onRefresh={() =>
                getPostSeoData.metaDescriptions.refresh({
                  postHTML,
                })
              }
              disabled={!components.metaDescription}
              disabledMessage="Enabled Yoast to get meta description recommendations."
            />

            <TextOptionList
              title="Meta Title"
              isLoading={getPostSeoData.metaTitles.isLoading}
              hasError={getPostSeoData.metaTitles.isError}
              options={getPostSeoData.metaTitles.data}
              onSelect={editMetaTitle}
              updateOptions={getPostSeoData.metaTitles.update}
              onRefresh={() =>
                getPostSeoData.metaTitles.refresh({
                  postHTML,
                })
              }
              disabled={!components.metaTitle}
              disabledMessage="Enabled Yoast to get meta title recommendations."
            />
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

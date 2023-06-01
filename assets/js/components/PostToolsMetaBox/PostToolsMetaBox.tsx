import { useGetPostSEOData } from 'assets/js/application/useGetPostSEOData'
import { notaService } from 'assets/js/services/notaService/notaService'
import { useSelect } from '@wordpress/data'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from '@wordpress/element'
import { ScreenInitial } from 'assets/js/components/PostToolsMetaBox/ScreenInitial'
import { ScreenResults } from 'assets/js/components/PostToolsMetaBox/ScreenResults'
import { Notice } from '@wordpress/components'

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
  summary: true,
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

  if (!window.notaTools.tools_active) {
    return (
      <Notice
        status="error"
        isDismissible={false}
        className="ntw-border-l-[4px]"
      >
        Please ensure you have set an API key to continue using Nota&apos;s
        tools.
      </Notice>
    )
  }

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
          <ScreenResults
            seoData={getPostSeoData}
            components={components}
            postHTML={postHTML}
          />
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

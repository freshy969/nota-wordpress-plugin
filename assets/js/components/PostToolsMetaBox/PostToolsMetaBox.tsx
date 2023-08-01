import { useGetPostSEOData } from 'assets/js/application/useGetPostSEOData'
import { notaService } from 'assets/js/services/notaService/notaService'
import { useSelect } from '@wordpress/data'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from '@wordpress/element'
import { ScreenInitial } from 'assets/js/components/PostToolsMetaBox/ScreenInitial'
import { ScreenResults } from 'assets/js/components/PostToolsMetaBox/ScreenResults'
import { Notice } from 'assets/js/components/Notice/Notice'

enum Screen {
  Initial,
  Results,
}
const useWpSelect = useSelect as WordPress.useSelect

// this needs to be declared outside of the component
// or memoized. Otherwise it'll trigger infinite re-renders within useGetPostSEOData
const components = {
  hashtags: window.notaTools.components.hashtags,
  headlines: true,
  metaDescriptions: window.notaTools.components.meta_description,
  metaTitles: window.notaTools.components.meta_title,
  tags: window.notaTools.components.tags,
  excerpt: true,
  socialPostsFacebook: window.notaTools.components.social_posts_facebook,
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

  const componentKeys = Object.keys(components) as (keyof typeof components)[]
  const hasData = componentKeys.some((key) => getPostSeoData[key].data?.length)

  // if we have some initial data, update the screen to display it
  useEffect(() => {
    if (hasData) setScreen(Screen.Results)
  }, [hasData])

  if (!window.notaTools.tools_active) {
    return (
      <Notice level="error">
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

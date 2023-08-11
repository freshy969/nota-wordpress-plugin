import {
  ComponentTypes,
  useGetPostSEOData,
} from 'assets/js/application/useGetPostSEOData'
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
  excerpt: true,
  hashtags: window.notaTools.components.hashtags,
  headlines: true,
  slugs: true,
  metaDescriptions: window.notaTools.components.meta_description,
  metaTitles: window.notaTools.components.meta_title,
  socialPostsFacebook: window.notaTools.components.social_posts_facebook,
  socialPostsInstagram: window.notaTools.components.social_posts_instagram,
  socialPostsLinkedIn: window.notaTools.components.social_posts_linkedin,
  socialPostsThreads: window.notaTools.components.social_posts_threads,
  socialPostsTikTok: window.notaTools.components.social_posts_tiktok,
  socialPostsTwitter: window.notaTools.components.social_posts_twitter,
  tags: window.notaTools.components.tags,
  sms: window.notaTools.components.sms,
}

const componentMap: Record<string, ComponentTypes[]> = {
  content: ['excerpt', 'headlines', 'tags'],
  seo: ['metaDescriptions', 'slugs', 'metaTitles'],
  social: [
    'socialPostsFacebook',
    'socialPostsInstagram',
    'socialPostsLinkedIn',
    'socialPostsThreads',
    'socialPostsTikTok',
    'socialPostsTwitter',
    'sms',
    'hashtags',
  ],
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
  const [tabsToRefresh, setTabsToRefresh] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState<string>(
    Object.keys(componentMap)[0],
  )

  const componentKeys = Object.keys(components) as (keyof typeof components)[]
  const hasData = componentKeys.some((key) => getPostSeoData[key].data?.length)

  // if we have some initial data, update the screen to display it
  useEffect(() => {
    if (hasData) setScreen(Screen.Results)
  }, [hasData])

  // This handles refreshing of tabs.
  // We only want a tab to refresh when it is active.
  useEffect(() => {
    if (!tabsToRefresh.includes(currentTab)) {
      return
    }
    const currentRefreshIndex = tabsToRefresh.indexOf(currentTab)
    setTabsToRefresh([
      ...tabsToRefresh.slice(0, currentRefreshIndex),
      ...tabsToRefresh.slice(currentRefreshIndex + 1),
    ])
    if (!componentMap[currentTab]) return

    componentMap[currentTab].forEach((component) =>
      getPostSeoData[component].refresh({ postHTML }),
    )
  }, [tabsToRefresh, currentTab, postHTML, getPostSeoData])

  const onTabChange = (tab: string) => {
    setCurrentTab(tab)
    const tabComponents = componentMap[tab]
    if (!tabComponents) return

    // some tabs may not be highlighted yet
    // but may have initial, saved data
    // so even if it runs, only run on new inputs
    const componentsToRun = tabComponents.filter((component) => {
      return !getPostSeoData[component].data?.length
    })
    getPostSeoData.run({
      postHTML,
      components: componentsToRun,
    })
  }

  const onReanalyze = () => {
    setTabsToRefresh(Object.keys(componentMap))
  }

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
            onTabChange('content')
          }}
        />
      )}
      {screen === Screen.Results && (
        <div>
          <ScreenResults
            seoData={getPostSeoData}
            components={components}
            postHTML={postHTML}
            onTabChange={onTabChange}
            onReanalyze={onReanalyze}
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

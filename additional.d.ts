type MetaKeys =
  | 'seo_title'
  | 'seo_desc'
  | 'headline_history'
  | 'excerpt_history'
  | 'tag_history'
  | 'seo_title_history'
  | 'seo_desc_history'
interface Window {
  notaTools: {
    ajaxUrl: string
    nonce: string
    components: {
      categories: boolean
      meta_description: boolean
      meta_title: boolean
      tags: boolean
    }
    meta_keys: Record<MetaKeys, string>
    post_title_suffix: string
    register_controls: {
      seo: boolean
    }
    tools_active: boolean
  }
}

// many of the WordPress data stores are not typed properly
// and for some reason redeclaring the @wordpress/data module doesn't augment
// it only overwrites it. The easiest way is to just namespace these separately
namespace WordPress {
  interface WordPressSite {
    date_format: string
    title: string
    url: string
  }

  interface WordPressPost {
    meta: Record<string, string>
    tags: number[]
    title: string
  }

  interface CoreStoreSelectors {
    getTaxonomy: (taxonomy: string) =>
      | {
          rest_base: string
          rest_namespace?: string
        }
      | undefined
    getEntityRecords: <T>(type: string, slug: string, query: any) => T | null
    getSite: () => WordPressSite | null
    hasFinishedResolution: (type: string, q: [string, string, any]) => boolean
  }

  interface CoreEditorStoreSelectors {
    getCurrentPost: () => WordPressPost
    getCurrentPostId: () => number
    getEditedPostContent: () => string
    getEditedPostAttribute: <T>(attribute: string) => T
    getPermalinkParts: () => {
      prefix: string
      postName: string
      suffix: string
    } | null
  }

  interface YoastEditorStoreSelectors {
    getDescription: () => string
    getSeoTitle: () => string
    getSeoTitleTemplate: () => string
    getSnippetEditorData: () => {
      title: string
      description: string
    }
  }

  function WpDataSelectFn(store: 'core'): CoreStoreSelectors
  function WpDataSelectFn(store: 'core/editor'): CoreEditorStoreSelectors
  function WpDataSelectFn(
    store: 'yoast-seo/editor',
  ): YoastEditorStoreSelectors | null

  export type useSelect = <T>(
    selector: (s: typeof WpDataSelectFn) => T,
    deps?: any[],
  ) => T
}

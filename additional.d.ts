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
  }
}

// many of the WordPress data stores are not typed properly
// and for some reason redeclaring the @wordpress/data module doesn't augment
// it only overwrites it. The easiest way is to just namespace these separately
namespace WordPress {
  interface CoreStoreSelectors {
    getTaxonomy: (taxonomy: string) =>
      | {
          rest_base: string
          rest_namespace?: string
        }
      | undefined
  }

  interface CoreEditorStoreSelectors {
    getEditedPostContent: () => string
    getEditedPostAttribute: <T>(attribute: string) => T
  }

  interface YoastEditorStoreSelectors {
    getSeoTitleTemplate: () => string
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

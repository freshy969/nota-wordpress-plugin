import { useDispatch, useSelect } from '@wordpress/data'
import { logger } from 'assets/js/utils/logger/logger'

const useWpSelect = useSelect as WordPress.useSelect

export const useEditMetadata = () => {
  // this may not be defined at the time this runs
  // Yoast needs to initialise first
  // or the user may not have Yoast enabled
  // we always update our meta tags as a fallback
  const yoastEditor = useDispatch('yoast-seo/editor')
  const seoData = useWpSelect((select) => {
    const _yoast = select('yoast-seo/editor')
    const coreEditor = select('core/editor')
    const postMeta =
      coreEditor.getEditedPostAttribute<Record<string, string>>('meta')
    return {
      metaDescription:
        _yoast?.getDescription() ||
        postMeta?.[window.notaTools.meta_keys.seo_desc],
      seoTitleTemplate: _yoast?.getSeoTitleTemplate(),
      seoTitleFormatted:
        _yoast?.getSeoTitle() ||
        postMeta?.[window.notaTools.meta_keys.seo_title],
    }
  }, [])
  const coreEditor = useDispatch('core/editor')

  const editMetaDescription = (description: string) => {
    coreEditor
      .editPost({
        meta: { [window.notaTools.meta_keys.seo_desc]: description },
      })
      .catch(logger.error)

    yoastEditor
      ?.updateData({
        description,
      })
      .catch(logger.error)
  }

  const editMetaTitle = (title: string) => {
    coreEditor
      .editPost({
        meta: { [window.notaTools.meta_keys.seo_title]: title },
      })
      .catch(logger.error)

    // first check if the SEO title template has the title in it
    // otherwise use the default
    // https://yoast.com/help/list-available-snippet-variables-yoast-seo/
    const defaultSeoTitleTemplate = '%%title%% %%page%% %%sep%% %%sitename%%'
    const template = seoData?.seoTitleTemplate?.includes('%%title%%')
      ? seoData?.seoTitleTemplate
      : defaultSeoTitleTemplate
    const nextTitle = template.replace('%%title%%', title)
    yoastEditor
      ?.updateData({
        title: nextTitle,
      })
      .catch(logger.error)
  }
  return {
    editMetaDescription,
    editMetaTitle,
    metaDescription: seoData.metaDescription,
    metaTitleFormatted: seoData.seoTitleFormatted,
  }
}

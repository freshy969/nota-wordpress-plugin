import { useDispatch, useSelect } from '@wordpress/data'
import { logger } from 'assets/js/utils/logger/logger'

const useWpSelect = useSelect as WordPress.useSelect

export const useEditMetadata = () => {
  // this may not be defined at the time this runs
  // Yoast needs to initialise first
  const yoastEditor = useDispatch('yoast-seo/editor')
  const yoastData = useWpSelect((select) => {
    const _yoast = select('yoast-seo/editor')
    return {
      seoTitleTemplate: _yoast?.getSeoTitleTemplate(),
    }
  }, [])

  const editMetaDescription = (description: string) => {
    yoastEditor
      ?.updateData({
        description,
      })
      .catch(logger.error)
  }

  const editMetaTitle = (title: string) => {
    // first check if the SEO title template has the title in it
    // otherwise use the default
    // https://yoast.com/help/list-available-snippet-variables-yoast-seo/
    const defaultSeoTitleTemplate = '%%title%% %%page%% %%sep%% %%sitename%%'
    const template = yoastData?.seoTitleTemplate?.includes('%%title%%')
      ? yoastData?.seoTitleTemplate
      : defaultSeoTitleTemplate
    const nextTitle = template.replace('%%title%%', title)
    yoastEditor
      ?.updateData({
        title: nextTitle,
      })
      .catch(logger.error)
  }
  return { editMetaDescription, editMetaTitle }
}

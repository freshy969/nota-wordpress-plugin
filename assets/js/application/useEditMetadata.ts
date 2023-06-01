import { useDispatch, useSelect } from '@wordpress/data'
import { useRevision } from 'assets/js/application/useRevision'
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
    const yoastRawData = _yoast?.getSnippetEditorData()

    return {
      yoastValues: yoastRawData,
      metaValues: {
        description: postMeta?.[window.notaTools.meta_keys.seo_desc],
        title: postMeta?.[window.notaTools.meta_keys.seo_title],
      },
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
  const metaTitleHistory = useRevision({
    trackValue: seoData.metaValues.title,
    revertFn: (lastValue) => {
      coreEditor.editPost({
        meta: { [window.notaTools.meta_keys.seo_title]: lastValue },
      })
    },
  })
  const metaDescHistory = useRevision({
    trackValue: seoData.metaValues.description,
    revertFn: (lastValue) => {
      coreEditor.editPost({
        meta: { [window.notaTools.meta_keys.seo_desc]: lastValue },
      })
    },
  })
  const yoastTitleHistory = useRevision({
    trackValue: seoData.yoastValues?.title,
    revertFn: (lastValue) => {
      yoastEditor
        ?.updateData({
          title: lastValue,
        })
        .catch(logger.error)
    },
  })
  const yoastDescriptionHistory = useRevision({
    trackValue: seoData.yoastValues?.description,
    revertFn: (lastValue) => {
      yoastEditor
        ?.updateData({
          description: lastValue,
        })
        .catch(logger.error)
    },
  })

  const editMetaDescription = (description: string) => {
    coreEditor
      .editPost({
        meta: { [window.notaTools.meta_keys.seo_desc]: description },
      })
      .catch(logger.error)
    metaDescHistory.update(description)

    yoastEditor
      ?.updateData({
        description,
      })
      .catch(logger.error)
    yoastDescriptionHistory.update(description)
  }

  const editMetaTitle = (title: string) => {
    coreEditor
      .editPost({
        meta: { [window.notaTools.meta_keys.seo_title]: title },
      })
      .catch(logger.error)
    metaTitleHistory.update(title)

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
    yoastTitleHistory.update(nextTitle)
  }

  const revertMetaDescription = () => {
    yoastDescriptionHistory.revert()
    metaDescHistory.revert()
  }
  const revertMetaTitle = () => {
    yoastTitleHistory.revert()
    metaTitleHistory.revert()
  }
  return {
    editMetaDescription,
    editMetaTitle,
    metaDescription: seoData.metaValues.description,
    metaTitle: seoData.metaValues.title,
    metaTitleFormatted: seoData.seoTitleFormatted,
    revertMetaDescription,
    revertMetaTitle,
  }
}

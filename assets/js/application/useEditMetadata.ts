import { useDispatch } from '@wordpress/data'
import { logger } from 'assets/js/utils/logger/logger'

export const useEditMetadata = () => {
  // this may not be defined at the time this runs
  // Yoast needs to initialise first
  const yoastEditor = useDispatch('yoast-seo/editor')

  const editMetaDescription = (description: string) => {
    yoastEditor
      ?.updateData({
        description,
      })
      .catch(logger.error)
  }
  return { editMetaDescription }
}

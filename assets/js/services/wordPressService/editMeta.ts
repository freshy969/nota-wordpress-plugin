import { WordPressService } from 'assets/js/services/types'
import apiFetch from '@wordpress/api-fetch'

export const editMeta: WordPressService['editMeta'] = async ({
  key,
  value,
  postId,
}) => {
  await apiFetch({
    path: `/wp/v2/posts/${postId}`,
    method: 'POST',
    data: {
      meta: {
        [key]: value,
      },
    },
  })
}

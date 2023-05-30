import { useDispatch, useSelect } from '@wordpress/data'

const useWpSelect = useSelect as WordPress.useSelect

export const useEditPostTitle = () => {
  const { editPost } = useDispatch('core/editor')
  const { postTitle } = useWpSelect((select) => {
    const coreEditor = select('core/editor')
    return {
      postTitle: coreEditor.getEditedPostAttribute<string>('title'),
    }
  })

  return {
    editPostTitle: (title: string) => {
      editPost({
        title,
      })
    },
    postTitle,
  }
}

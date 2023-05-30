import { useDispatch } from '@wordpress/data'

export const useEditPostData = () => {
  const { editPost } = useDispatch('core/editor')

  return {
    editPostTitle: (title: string) => {
      editPost({
        title,
      })
    },
    editPostExcerpt: (excerpt: string) => {
      editPost({
        excerpt,
      })
    },
  }
}

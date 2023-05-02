import { useDispatch } from '@wordpress/data'

export const useEditPostTitle = () => {
  const { editPost } = useDispatch('core/editor')

  return (title: string) => {
    editPost({
      title,
    })
  }
}

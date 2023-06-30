import { useDispatch, useSelect } from '@wordpress/data'
import { useRevision } from 'assets/js/application/useRevision'

const useWpSelect = useSelect as WordPress.useSelect

export const useEditPostData = () => {
  const { editPost } = useDispatch('core/editor')
  const { postTitle, postExcerpt } = useWpSelect((select) => {
    const coreEditor = select('core/editor')
    return {
      postTitle: coreEditor.getEditedPostAttribute<string>('title'),
      postExcerpt: coreEditor.getEditedPostAttribute<string>('excerpt'),
    }
  })
  const titleHistory = useRevision({
    trackValue: postTitle,
    revertFn: (initialTitle) => {
      editPost({ title: initialTitle })
    },
  })
  const excerptHistory = useRevision({
    trackValue: postExcerpt,
    revertFn: (initialTitle) => {
      editPost({ excerpt: initialTitle })
    },
  })

  return {
    editPostTitle: (title: string) => {
      titleHistory.update(title)
      editPost({
        title,
      })
    },
    editPostExcerpt: (excerpt: string) => {
      excerptHistory.update(excerpt)
      editPost({
        excerpt,
      })
    },
    postExcerpt,
    postTitle,
    revertExcerpt: excerptHistory.revert,
    revertTitle: titleHistory.revert,
  }
}

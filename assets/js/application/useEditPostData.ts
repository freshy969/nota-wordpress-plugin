import { useDispatch, useSelect } from '@wordpress/data'
import { useRevision } from 'assets/js/application/useRevision'

const useWpSelect = useSelect as WordPress.useSelect

export const useEditPostData = () => {
  const { editPost } = useDispatch('core/editor')
  const { postTitle, postExcerpt, postSlug } = useWpSelect((select) => {
    const coreEditor = select('core/editor')
    return {
      postTitle: coreEditor.getEditedPostAttribute<string>('title'),
      postExcerpt: coreEditor.getEditedPostAttribute<string>('excerpt'),
      postSlug: coreEditor.getEditedPostAttribute<string>('slug'),
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
  const slugHistory = useRevision({
    trackValue: postSlug,
    revertFn: (initialTitle) => {
      editPost({ slug: initialTitle })
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
    editPostSlug: (slug: string) => {
      slugHistory.update(slug)
      editPost({
        slug,
      })
    },
    postExcerpt,
    postTitle,
    postSlug,
    revertExcerpt: excerptHistory.revert,
    revertTitle: titleHistory.revert,
    revertSlug: slugHistory.revert,
  }
}

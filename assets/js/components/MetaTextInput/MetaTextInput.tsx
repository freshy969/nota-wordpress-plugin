import { TextControl } from '@wordpress/components'
import { useSelect, useDispatch } from '@wordpress/data'

const useWpSelect = useSelect as WordPress.useSelect

interface Props {
  metaKey: string
  label: string
}

export function MetaTextInput({ metaKey, label }: Props) {
  const fieldValue = useWpSelect(
    (select) => {
      return (
        select('core/editor').getEditedPostAttribute<Record<string, string>>(
          'meta',
        )?.[metaKey] || ''
      )
    },
    [metaKey],
  )

  const { editPost } = useDispatch()

  return (
    <TextControl
      onChange={(nextValue) => editPost({ meta: { [metaKey]: nextValue } })}
      value={fieldValue}
      label={label}
    />
  )
}

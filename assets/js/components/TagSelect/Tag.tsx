import { useMemo } from '@wordpress/element'

interface Props {
  tag: string
  tags: string[]
  onClick: () => void
}

export function Tag({ tag, tags, onClick }: Props) {
  const backgroundColor = useMemo(() => {
    const tagIndex = tags.indexOf(tag)
    return `rgba(136, 176, 255, ${1 - (1 / tags.length) * tagIndex})`
  }, [tag, tags])

  return (
    <button
      className="ntw-appearance-none ntw-rounded-full ntw-px-16px ntw-py-8px ntw-text-typography-dark hover:ntw-ring-1 hover:ntw-ring-button-hover"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {tag}
    </button>
  )
}

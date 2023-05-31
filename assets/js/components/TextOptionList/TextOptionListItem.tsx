import { useEffect, useRef } from '@wordpress/element'
import { Button } from 'assets/js/components/Button/Button'
import clsx from 'clsx'

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: () => void
  selected?: boolean
  onRevert: () => void
}

export function TextOptionListItem({
  value,
  onChange,
  onSelect,
  selected,
  onRevert,
}: Props): React.ReactElement {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // updates the size of the textarea as the value changes
  useEffect(() => {
    if (!textAreaRef.current) return
    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    textAreaRef.current.style.height = '0px'
    const scrollHeight = textAreaRef.current.scrollHeight

    // We then set the height directly, outside of the render loop
    // Trying to set this with state or a ref will product an incorrect value.
    textAreaRef.current.style.height = scrollHeight + 'px'
  }, [textAreaRef, value])

  return (
    <div
      className={clsx(
        'ntw-group ntw-flex ntw-items-center ntw-justify-between ntw-rounded-lg ntw-border ntw-border-gray-100 ntw-p-16px',
        {
          'ntw-bg-gamma-ray-200': selected,
        },
      )}
    >
      <div className="ntw-flex-1">
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          style={{ minHeight: '1.5rem' }}
          className="ntw-w-full ntw-resize-none ntw-border-none ntw-bg-transparent ntw-text-paragraph-base ntw-shadow-none ntw-outline-none"
          disabled={selected}
        />
      </div>
      <div
        className={clsx('ntw-ml-16px', {
          'ntw-opacity-0 group-hover:ntw-opacity-100': !selected,
        })}
      >
        {selected ? (
          <Button onClick={onRevert} size={300}>
            Revert
          </Button>
        ) : (
          <Button onClick={onSelect} variant="secondary" size={300}>
            Select
          </Button>
        )}
      </div>
    </div>
  )
}

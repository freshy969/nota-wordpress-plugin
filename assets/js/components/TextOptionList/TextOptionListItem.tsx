import { useEffect, useRef } from '@wordpress/element'
import { Button } from 'assets/js/components/Button/Button'

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: () => void
}

export function TextOptionListItem({
  value,
  onChange,
  onSelect,
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
    <div className="ntw-flex ntw-items-center ntw-justify-between ntw-rounded-lg ntw-border ntw-border-gray-100 ntw-p-16px">
      <div className="ntw-flex-1">
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          style={{ minHeight: '1.5rem' }}
          className="ntw-w-full ntw-resize-none ntw-border-none ntw-text-paragraph-base ntw-shadow-none ntw-outline-none"
        />
      </div>
      <div className="ntw-ml-16px">
        <Button onClick={onSelect} variant="secondary" size={300}>
          Use suggestion
        </Button>
      </div>
    </div>
  )
}

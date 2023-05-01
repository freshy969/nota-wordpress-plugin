import { Button, TextControl } from '@wordpress/components'

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: () => void
  edit: boolean
}

export function TextOptionListItem({
  value,
  onChange,
  onSelect,
  edit,
}: Props): React.ReactElement {
  return (
    <div>
      {edit ? (
        <TextControl value={value} onChange={(e) => onChange(e)} />
      ) : (
        <div className="ntw-flex ntw-items-center ntw-justify-between">
          <div className="ntw-flex-1">{value}</div>
          <div>
            <Button onClick={onSelect} variant="secondary">
              Use suggestion
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

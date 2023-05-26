import { TextOptionListItem } from 'assets/js/components/TextOptionList/TextOptionListItem'
import { useState } from '@wordpress/element'
import { Button } from '@wordpress/components'
import { AsyncStateManager } from 'assets/js/components/AsyncStateManager/AsyncStateManager'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'

interface Props {
  options?: string[]
  updateOptions: (options: string[]) => void
  onSelect: (option: string) => void
  onRefresh: () => void
  title: string
  subtitle: string
  isLoading: boolean
  hasError: boolean
  disabled?: boolean
  disabledMessage?: string
}
export function TextOptionList({
  options,
  updateOptions,
  onSelect,
  onRefresh,
  title,
  subtitle,
  isLoading,
  hasError,
  disabled,
  disabledMessage,
}: Props) {
  const [edit, setEdit] = useState(false)
  const [edits, setEdits] = useState(options || [])
  const displayedOptions = edit ? edits : options
  return (
    <div>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        className="ntw-mb-24px"
      />
      {disabled ? (
        <div>{disabledMessage || 'Currently unavailable.'}</div>
      ) : (
        <AsyncStateManager
          isLoading={isLoading}
          hasError={hasError}
          retry={onRefresh}
        >
          <div className="ntw-mb-4">
            {edit ? (
              <div className="ntw-space-x-2">
                <Button
                  variant="secondary"
                  isDestructive
                  onClick={() => setEdit(false)}
                >
                  Cancel changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    updateOptions(edits)
                    setEdit(false)
                  }}
                >
                  Update
                </Button>
              </div>
            ) : (
              <div className="ntw-space-x-2">
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setEdits(options || [])
                    setEdit(true)
                  }}
                >
                  Edit suggestions
                </Button>
                <Button variant="tertiary" onClick={onRefresh}>
                  Refresh suggestions
                </Button>
              </div>
            )}
          </div>
          <div className="ntw-divide-gray-200 ntw-bg-white ntw-ring-gray-300 ntw-divide-x-0 ntw-divide-y ntw-divide-solid ntw-shadow-sm ntw-ring-1">
            {displayedOptions?.map((option, idx) => (
              <div
                key={`${idx}-${options?.[idx]}`}
                className="ntw-px-6 ntw-py-5"
              >
                <TextOptionListItem
                  value={option}
                  onChange={(nextEdit) => {
                    const nextEdits = [...edits]
                    nextEdits[idx] = nextEdit
                    setEdits(nextEdits)
                  }}
                  onSelect={() => onSelect(option)}
                  edit={edit}
                />
              </div>
            ))}
          </div>
        </AsyncStateManager>
      )}
    </div>
  )
}

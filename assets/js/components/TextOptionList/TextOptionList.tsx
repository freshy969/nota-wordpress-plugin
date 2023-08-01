import { TextOptionListItem } from 'assets/js/components/TextOptionList/TextOptionListItem'
import { AsyncStateManager } from 'assets/js/components/AsyncStateManager/AsyncStateManager'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'
import { History } from 'assets/js/application/useHistoryList'

interface Props {
  options?: string[]
  updateOptions: (options: string[]) => void
  onSelect?: (option: string) => void
  onRefresh: () => void
  title: string
  subtitle: string
  isLoading: boolean
  error?: unknown
  disabled?: boolean
  disabledMessage?: string
  history?: History
  currentValue?: string
  onRevert?: () => void
}
export function TextOptionList({
  options,
  updateOptions,
  onSelect,
  onRefresh,
  title,
  subtitle,
  isLoading,
  error,
  disabled,
  disabledMessage,
  history,
  currentValue,
  onRevert,
}: Props) {
  return (
    <div>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        className="ntw-mb-24px"
        onRefresh={onRefresh}
        history={history}
      />

      {disabled ? (
        <div>{disabledMessage || 'Currently unavailable.'}</div>
      ) : (
        <AsyncStateManager
          isLoading={isLoading}
          error={error}
          retry={onRefresh}
        >
          <div className="ntw-space-y-16px">
            {options?.map((option, idx) => (
              <div key={idx}>
                <TextOptionListItem
                  value={option}
                  onChange={(nextEdit) => {
                    if (!options) return
                    const nextEdits = [...options]
                    nextEdits[idx] = nextEdit
                    updateOptions(nextEdits)
                  }}
                  onSelect={onSelect ? () => onSelect(option) : undefined}
                  selected={currentValue === option}
                  onRevert={onRevert}
                />
              </div>
            ))}
          </div>
        </AsyncStateManager>
      )}
    </div>
  )
}

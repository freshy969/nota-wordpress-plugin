import { TextOptionListItem } from 'assets/js/components/TextOptionList/TextOptionListItem'

interface Props {
  options?: string[]
  updateOptions: (options: string[]) => void
  onSelect: (option: string) => void
  edit: boolean
}
export function TextOptionList({
  options,
  updateOptions,
  onSelect,
  edit,
}: Props) {
  return (
    <div className="ntw-divide-x-0 ntw-divide-y ntw-divide-solid ntw-divide-gray-100 ntw-rounded-xl ntw-bg-white ntw-shadow-sm ntw-ring-1 ntw-ring-gray-300">
      {options?.map((option, idx) => (
        <div key={option} className="ntw-px-6 ntw-py-5">
          <TextOptionListItem
            value={option}
            onChange={(nextOption) => {
              const nextOptions = [...options]
              nextOptions[idx] = nextOption
              updateOptions(nextOptions)
            }}
            onSelect={() => onSelect(option)}
            edit={edit}
          />
        </div>
      ))}
    </div>
  )
}

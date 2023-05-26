import { Button } from 'assets/js/components/Button/Button'

interface Props {
  onSubmit: () => void
}

export function ScreenInitial({ onSubmit }: Props) {
  return (
    <div>
      <div className="ntw-mb-24px ntw-text-h-900">Welcome to Nota</div>
      <div className="ntw-flex ntw-items-center ntw-justify-between ntw-rounded-2xl ntw-p-24px ntw-shadow">
        <div>
          <p className="ntw-mb-8px ntw-text-h-800">Get Started</p>
          <p className="ntw-text-paragraph-tight">
            Analyze the current page and generate texts by Artificial
            Intelligence
          </p>
        </div>
        <div className="ntw-flex-shrink-0">
          <Button onClick={onSubmit}>Analyze page</Button>
        </div>
      </div>
    </div>
  )
}

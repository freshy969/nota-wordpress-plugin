import { Button } from 'assets/js/components/Button/Button'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'

interface Props {
  onSubmit: () => void
}

export function ScreenInitial({ onSubmit }: Props) {
  return (
    <div>
      <div className="ntw-mb-24px ntw-text-h-900">Welcome to Nota</div>
      <div className="ntw-flex ntw-items-center ntw-justify-between ntw-rounded-2xl ntw-p-24px ntw-shadow">
        <SectionHeading
          title="Get Started"
          subtitle="Analyze the current page and generate texts by Artificial Intelligence"
        />
        <div className="ntw-flex-shrink-0">
          <Button onClick={onSubmit}>Analyze page</Button>
        </div>
      </div>
    </div>
  )
}

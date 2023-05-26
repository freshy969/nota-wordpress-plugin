import { ArrowsClockwise } from '@phosphor-icons/react'

interface Props {
  title: string
  subtitle: string
  className?: string
  onRefresh?: () => void
}
export function SectionHeading({
  title,
  subtitle,
  className,
  onRefresh,
}: Props) {
  return (
    <div className={className}>
      <div className="ntw-group">
        <div className="ntw-group ntw-flex ntw-items-start ntw-justify-between">
          <div>
            <p className="ntw-mb-8px ntw-text-h-800">{title}</p>
            <p className="ntw-text-paragraph-tight">{subtitle}</p>
          </div>
          <div className="ntw-flex-shrink-0 ntw-space-x-16px ntw-text-typography-disabled ntw-opacity-0 group-hover:ntw-opacity-100">
            {onRefresh && (
              <button
                className="hover:ntw-text-button-hover"
                onClick={onRefresh}
              >
                <ArrowsClockwise size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

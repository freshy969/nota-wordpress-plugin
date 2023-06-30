import { ArrowsClockwise, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { History } from 'assets/js/application/useHistoryList'
import clsx from 'clsx'

interface Props {
  title: string
  subtitle: string
  className?: string
  onRefresh?: () => void
  history?: History
}
export function SectionHeading({
  title,
  subtitle,
  className,
  onRefresh,
  history,
}: Props) {
  return (
    <div className={className}>
      <div className="ntw-group">
        <div className="ntw-group ntw-flex ntw-items-start ntw-justify-between">
          <div>
            <p className="ntw-mb-8px ntw-text-h-800">{title}</p>
            <p className="ntw-text-paragraph-tight">{subtitle}</p>
          </div>
          <div className="ntw-flex ntw-flex-shrink-0 ntw-items-center ntw-space-x-16px ntw-text-typography-disabled ntw-opacity-0 group-hover:ntw-opacity-100">
            {onRefresh && (
              <button
                className="hover:ntw-text-button-hover"
                onClick={onRefresh}
              >
                <ArrowsClockwise size={16} />
              </button>
            )}
            {!!history && (
              <div className="ntw-flex ntw-items-center">
                <button
                  onClick={history.prevHistoryItem}
                  className={clsx('ntw-text-typography-disabled', {
                    'hover:ntw-text-button-hover': history.hasPrev,
                  })}
                  disabled={!history.hasPrev}
                >
                  <CaretLeft size={16} />
                </button>
                <span>
                  {history.historyIndex + 1} / {history.totalHistoryItems}
                </span>
                <button
                  onClick={history.nextHistoryItem}
                  className={clsx('ntw-text-typography-disabled', {
                    'hover:ntw-text-button-hover': history.hasNext,
                  })}
                  disabled={!history.hasNext}
                >
                  <CaretRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

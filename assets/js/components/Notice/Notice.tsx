import { WarningCircle } from '@phosphor-icons/react'
import clsx from 'clsx'

type Levels = 'error'

const classNameMap: Record<Levels, string> = {
  error: 'ntw-bg-status-error-10 ntw-text-status-error-100',
}

const iconMap = {
  error: WarningCircle,
}

interface Props {
  level: Levels
  children: React.ReactNode
}
export function Notice({ level, children }: Props) {
  const Icon = iconMap[level]
  return (
    <div
      className={clsx(
        'ntw-flex ntw-rounded-lg ntw-p-24px',
        classNameMap[level],
      )}
    >
      <Icon size={24} className="ntw-mr-8px ntw-flex-shrink-0" />
      <div className="ntw-flex-1">{children}</div>
    </div>
  )
}

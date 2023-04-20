import clsx from 'clsx'

interface Props {
  onClick: () => void | Promise<void>
  children: React.ReactNode
  className?: string
}
export const Button = ({ onClick, children, className }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'ntw-cursor-pointer ntw-rounded ntw-border ntw-border-solid ntw-border-gray-200 ntw-bg-gray-100 ntw-px-3 ntw-py-1.5 ntw-text-sm ntw-leading-6 ntw-text-gray-700 ntw-shadow-sm hover:ntw-bg-gray-200',
        className,
      )}
    >
      {children}
    </button>
  )
}

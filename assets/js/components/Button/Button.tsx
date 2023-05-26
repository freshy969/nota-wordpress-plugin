import clsx from 'clsx'

type Variants = 'primary' | 'secondary'
type Sizes = 500 | 300
interface Props {
  variant?: Variants
  onClick: () => void
  children: React.ReactNode
  size?: Sizes
}

const variantMap: Record<Variants, string[]> = {
  primary: [
    'ntw-bg-button-default ntw-text-typography-light',
    'hover:ntw-bg-button-hover',
  ],
  secondary: [
    'ntw-ring-button-default ntw-text-button-default ntw-ring-1',
    'hover:ntw-ring-button-hover',
  ],
}

export function Button({
  variant = 'primary',
  onClick,
  children,
  size = 500,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'ntw-appearance-none ntw-rounded ntw-text-base ntw-font-medium ntw-leading-4',
        variantMap[variant],
        {
          'ntw-p-16px': size === 500,
          'ntw-px-16px ntw-py-8px': size === 300,
        },
      )}
    >
      {children}
    </button>
  )
}

interface Props {
  title: string
  subtitle: string
  className?: string
}
export function SectionHeading({ title, subtitle, className }: Props) {
  return (
    <div className={className}>
      <p className="ntw-mb-8px ntw-text-h-800">{title}</p>
      <p className="ntw-text-paragraph-tight">{subtitle}</p>
    </div>
  )
}

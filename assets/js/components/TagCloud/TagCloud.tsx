import { AsyncStateManager } from 'assets/js/components/AsyncStateManager/AsyncStateManager'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'
import { History } from 'assets/js/application/useHistoryList'
import { Tag } from 'assets/js/components/Tag/Tag'

interface Props {
  title: string
  subtitle: string
  isLoading: boolean
  hasError: boolean
  history?: History
  onRefresh: () => void
  tags?: string[]
}
export function TagCloud({
  title,
  subtitle,
  isLoading,
  hasError,
  history,
  onRefresh,
  tags,
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
      <AsyncStateManager
        isLoading={isLoading}
        hasError={hasError}
        retry={onRefresh}
      >
        {!!tags?.length && (
          <div>
            <div className="ntw-mb-24px">
              <div className="ntw-flex ntw-flex-wrap ntw-gap-16px">
                {tags?.map((tag) => (
                  <Tag key={tag} tag={tag} tags={tags || []} />
                ))}
              </div>
            </div>
          </div>
        )}
      </AsyncStateManager>
    </div>
  )
}

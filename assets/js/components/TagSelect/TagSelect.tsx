import { AsyncStateManager } from 'assets/js/components/AsyncStateManager/AsyncStateManager'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'
import { History } from 'assets/js/application/useHistoryList'
import { useAddTaxonomy } from 'assets/js/application/useAddTaxonomy'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'
import { Tag } from 'assets/js/components/Tag/Tag'

const taxonomy = 'post_tag'

interface Props {
  title: string
  subtitle: string
  isLoading: boolean
  error?: unknown
  history?: History
  onRefresh: () => void
  tags?: string[]
}
export function TagSelect({
  title,
  subtitle,
  isLoading,
  error,
  history,
  onRefresh,
  tags,
}: Props) {
  const { addTag, removeTag, existingTerms } = useAddTaxonomy({
    taxonomy,
    wpService: wordPressService,
  })

  const tagsAddedFromSuggestions = existingTerms.filter(({ name }) => {
    return tags?.includes(name)
  })
  const existingTagNames = existingTerms.map(({ name }) => name)
  const generatedTags = tags?.filter((tag) => !existingTagNames.includes(tag))

  return (
    <div>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        className="ntw-mb-24px"
        onRefresh={onRefresh}
        history={history}
      />
      <AsyncStateManager isLoading={isLoading} error={error} retry={onRefresh}>
        {!!generatedTags?.length && (
          <div>
            <div className="ntw-mb-24px">
              <div className="ntw-mb-16px ntw-text-typography-medium">
                Generated tags:
              </div>
              <div className="ntw-flex ntw-flex-wrap ntw-gap-16px">
                {generatedTags?.map((tag) => (
                  <Tag
                    key={tag}
                    tag={tag}
                    tags={tags || []}
                    onClick={() => addTag(tag)}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="ntw-mb-16px ntw-text-typography-medium">
                Selected tags:
              </div>
              <div className="ntw-flex ntw-flex-wrap ntw-gap-16px">
                {tagsAddedFromSuggestions?.map((tag) => (
                  <Tag
                    key={tag.id}
                    tag={tag.name}
                    tags={tags || []}
                    onClick={() => removeTag(tag.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </AsyncStateManager>
    </div>
  )
}

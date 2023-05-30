import { AsyncStateManager } from 'assets/js/components/AsyncStateManager/AsyncStateManager'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'
import { History } from 'assets/js/application/useHistoryList'
import { useAddTaxonomy } from 'assets/js/application/useAddTaxonomy'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'
import { Tag } from 'assets/js/components/TagSelect/Tag'

const taxonomy = 'post_tag'

interface Props {
  title: string
  subtitle: string
  isLoading: boolean
  hasError: boolean
  history?: History
  onRefresh: () => void
  tags?: string[]
}
export function TagSelect({
  title,
  subtitle,
  isLoading,
  hasError,
  history,
  onRefresh,
  tags,
}: Props) {
  const { addTag, removeTag, existingTerms } = useAddTaxonomy({
    taxonomy,
    wpService: wordPressService,
  })

  const tagsAddedFromSuggestions = existingTerms.filter(({ name }) =>
    tags?.includes(name),
  )
  const tagsAddedFromSuggestionsNames = tagsAddedFromSuggestions?.map(
    ({ name }) => name,
  )
  const otherTags = tags?.filter(
    (tag) => !tagsAddedFromSuggestionsNames?.includes(tag),
  )

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
        {!!otherTags?.length && (
          <div>
            <div className="ntw-mb-24px">
              <div className="ntw-mb-16px ntw-text-typography-medium">
                Generated tags:
              </div>
              <div className="ntw-flex ntw-flex-wrap ntw-gap-16px">
                {otherTags?.map((tag) => (
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

import { AsyncStateManager } from 'assets/js/components/AsyncStateManager/AsyncStateManager'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'
import { History } from 'assets/js/application/useHistoryList'
import { useAddTaxonomy } from 'assets/js/application/useAddTaxonomy'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'
import { Tag } from 'assets/js/components/TagSelect/Tag'
import { Button } from 'assets/js/components/Button/Button'
import { useState } from '@wordpress/element'

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
  // sometimes we may suggest a tag that already exists on the post
  // or that the user has added manually themselves
  // in this case we don't display it in the "generated tags" section
  // but we also don't want to show it as a "selected tag" as it makes it look
  // like it's something they or we have done through the tool
  const [manuallyAddedTagNames, setManuallyAddedTagNames] = useState<string[]>(
    [],
  )
  const { addTag, removeTag, existingTerms, revert } = useAddTaxonomy({
    taxonomy,
    wpService: wordPressService,
  })

  const handleAddTag = (tagName: string) => {
    setManuallyAddedTagNames([...manuallyAddedTagNames, tagName])
    addTag(tagName)
  }

  // not that this differs from manuallyAddedTagNames
  // because these are only the tags in the current history block that have been added
  // whereas manuallyAddedTagNames is anything that's been added
  const tagsAddedFromSuggestions = existingTerms.filter(({ name }) => {
    return tags?.includes(name) && manuallyAddedTagNames.includes(name)
  })
  const tagsAddedFromSuggestionsNames = tagsAddedFromSuggestions?.map(
    ({ name }) => name,
  )
  const existingTagNames = existingTerms.map(({ name }) => name)
  const generatedTags = tags?.filter(
    (tag) =>
      !tagsAddedFromSuggestionsNames?.includes(tag) &&
      !existingTagNames.includes(tag),
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
                    onClick={() => handleAddTag(tag)}
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
              {!!tagsAddedFromSuggestions.length && (
                <div className="ntw-mt-8px">
                  <Button onClick={revert} size={300}>
                    Revert
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </AsyncStateManager>
    </div>
  )
}

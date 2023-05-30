import { DotsThreeVertical } from '@phosphor-icons/react'
import { useSelect } from '@wordpress/data'
import { useEditMetadata } from 'assets/js/application/useEditMetadata'
import { IconWorld } from 'assets/js/components/icons/IconWorld'
import * as wpDate from '@wordpress/date'
import { useAddTaxonomy } from 'assets/js/application/useAddTaxonomy'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'

const useWpSelect = useSelect as WordPress.useSelect

export function Preview() {
  const { existingTerms } = useAddTaxonomy({
    taxonomy: 'post_tag',
    wpService: wordPressService,
  })
  const { metaDescription, metaTitleFormatted } = useEditMetadata()
  const { site, permalinks, postTitle, postDate } = useWpSelect((select) => {
    const coreSelect = select('core')
    const editorSelect = select('core/editor')
    return {
      permalinks: editorSelect.getPermalinkParts(),
      postTitle: editorSelect.getEditedPostAttribute<string>('title'),
      postDate: editorSelect.getEditedPostAttribute<string>('date'),
      site: coreSelect.getSite(),
    }
  })

  const urlParts =
    permalinks?.prefix
      .replace(/https?\:\/\//, '')
      .split('/')
      .filter((s) => !!s) || []

  return (
    <div className="ntw-grid ntw-grid-cols-2 ntw-gap-64px">
      <div className="ntw-font-google">
        <div className="ntw-mb-16px ntw-text-typography-medium">
          Google preview:
        </div>
        <div className="ntw-mb-16px ntw-flex ntw-items-start">
          <div className="ntw-mr-8px ntw-flex-shrink-0 ntw-rounded-full ntw-bg-[#F1F3F4] ntw-p-8px">
            <IconWorld className="ntw-w-16px" />
          </div>
          <div className="ntw-flex-1 ntw-text-paragraph-tight">
            <div className="ntw-mb-8px">{site?.title}</div>
            <div className="ntw-flex ntw-items-center ntw-text-typography-medium">
              <span className="ntw-line-clamp-1 ntw-flex-1">
                {urlParts.join(' > ')} &gt; {permalinks?.postName}
              </span>
              <DotsThreeVertical size={12} weight="bold" />
            </div>
          </div>
        </div>
        <div className="ntw-mb-8px ntw-line-clamp-2 ntw-text-paragraph-tight ntw-text-[#1A0DAB]">
          {metaTitleFormatted}
        </div>
        <div className="ntw-font-normal ntw-text-typography-medium">
          {!!site?.date_format && (
            <span>{wpDate.format(site.date_format, postDate)} — </span>
          )}
          {metaDescription}
        </div>
      </div>
      <div className="ntw-space-y-24px">
        <div>
          <div className="ntw-mb-16px ntw-text-typography-medium">
            Headline:
          </div>
          <div className="ntw-text-paragraph-medium">{postTitle}</div>
        </div>
        <div>
          <div className="ntw-mb-16px ntw-text-typography-medium">Tags:</div>
          <div className="ntw-flex ntw-flex-wrap ntw-gap-8px">
            {existingTerms.map((term) => (
              <span
                key={term.id}
                className="ntw-rounded-full ntw-bg-gamma-ray-600 ntw-px-8px ntw-py-4px ntw-text-paragraph-xs"
              >
                {term.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

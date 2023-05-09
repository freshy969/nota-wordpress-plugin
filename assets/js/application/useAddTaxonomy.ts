import { useSelect, useDispatch } from '@wordpress/data'
import { WordPressService } from 'assets/js/services/types'

const useWpSelect = useSelect as WordPress.useSelect

// will likely add categories etc
type SupportedTaxonomies = 'post_tag'

interface Args {
  taxonomy: SupportedTaxonomies
  wpService: Pick<WordPressService, 'findOrCreateTerm'>
}
export const useAddTaxonomy = ({ taxonomy, wpService }: Args) => {
  const { editPost } = useDispatch('core/editor')
  const { taxonomyDetail, termIds } = useWpSelect(
    (select) => {
      const { getTaxonomy } = select('core')
      const { getEditedPostAttribute } = select('core/editor')
      const _taxonomy = getTaxonomy(taxonomy)
      const _termIds = _taxonomy
        ? getEditedPostAttribute<number[]>(_taxonomy.rest_base)
        : []
      return {
        taxonomyDetail: _taxonomy,
        termIds: _termIds,
      }
    },
    [taxonomy],
  )

  const namespace = taxonomyDetail?.rest_namespace ?? 'wp/v2'
  return (term: string) => {
    if (!taxonomyDetail?.rest_base) throw Error('Missing rest_base')
    wpService
      .findOrCreateTerm({
        term,
        restBase: taxonomyDetail.rest_base,
        namespace,
      })
      .then((nextTerm) => {
        editPost({ [taxonomyDetail.rest_base]: [...termIds, nextTerm.id] })
      })
  }
}

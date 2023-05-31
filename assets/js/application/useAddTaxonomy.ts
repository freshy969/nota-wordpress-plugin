import { useSelect, useDispatch } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { useRevision } from 'assets/js/application/useRevision'
import { WordPressService } from 'assets/js/services/types'

const useWpSelect = useSelect as WordPress.useSelect

// will likely add categories etc
type SupportedTaxonomies = 'post_tag'

interface Args {
  taxonomy: SupportedTaxonomies
  wpService: Pick<WordPressService, 'findOrCreateTerm'>
}
export const useAddTaxonomy = ({ taxonomy, wpService }: Args) => {
  const [existingTerms, setExistingTerms] = useState<
    { name: string; id: number }[]
  >([])
  const { editPost } = useDispatch('core/editor')
  const { taxonomyDetail, termIds, hasResolvedTerms, resolvingExistingTerms } =
    useWpSelect(
      (select) => {
        const { getEntityRecords, getTaxonomy, hasFinishedResolution } =
          select('core')
        const { getEditedPostAttribute } = select('core/editor')
        const _taxonomy = getTaxonomy(taxonomy)
        const _termIds = _taxonomy
          ? getEditedPostAttribute<number[]>(_taxonomy.rest_base)
          : []

        const query = {
          _fields: 'id,name',
          context: 'view',
          include: _termIds.join(','),
          per_page: -1,
        }

        return {
          resolvingExistingTerms: _termIds.length
            ? getEntityRecords<{ id: number; name: string }[]>(
                'taxonomy',
                taxonomy,
                query,
              )
            : [],
          hasResolvedTerms: hasFinishedResolution('getEntityRecords', [
            'taxonomy',
            taxonomy,
            query,
          ]),
          taxonomyDetail: _taxonomy,
          termIds: _termIds,
        }
      },
      [taxonomy],
    )

  const termRevision = useRevision({
    trackValue: termIds,
    revertFn: (lastTerms) => {
      if (!taxonomyDetail?.rest_base) return
      editPost({ [taxonomyDetail.rest_base]: lastTerms })
    },
  })

  // we do this to stop the terms disappearing / appearing while WP
  // makes REST API requests
  useEffect(() => {
    if (hasResolvedTerms) {
      setExistingTerms(resolvingExistingTerms || [])
    }
  }, [resolvingExistingTerms, hasResolvedTerms])

  const namespace = taxonomyDetail?.rest_namespace ?? 'wp/v2'
  const addTag = (term: string) => {
    if (!taxonomyDetail?.rest_base) throw Error('Missing rest_base')
    wpService
      .findOrCreateTerm({
        term,
        restBase: taxonomyDetail.rest_base,
        namespace,
      })
      .then((nextTerm) => {
        const nextTerms = [...termIds, nextTerm.id]
        termRevision.update(nextTerms)
        editPost({ [taxonomyDetail.rest_base]: nextTerms })
      })
  }

  const removeTag = (termId: number) => {
    if (!taxonomyDetail?.rest_base) throw Error('Missing rest_base')
    // get the tag ID by the name
    const termIdIdx = termIds.indexOf(termId)
    if (termIdIdx < 0) return
    const nextTerms = [
      ...termIds.slice(0, termIdIdx),
      ...termIds.slice(termIdIdx + 1),
    ]
    termRevision.update(nextTerms)
    editPost({
      [taxonomyDetail.rest_base]: nextTerms,
    })
  }

  return { addTag, removeTag, existingTerms, revert: termRevision.revert }
}

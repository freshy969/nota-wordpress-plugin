import { WordPressService } from 'assets/js/services/types'
import escapeHtml from 'escape-html'
import apiFetch from '@wordpress/api-fetch'

export const findOrCreateTerm: WordPressService['findOrCreateTerm'] = async ({
  term,
  restBase,
  namespace,
}) => {
  const escapedTermName = escapeHtml(term)
  try {
    const response = await apiFetch<{ id: number; name: string }>({
      path: `/${namespace}/${restBase}`,
      method: 'POST',
      data: { name: escapedTermName },
    })
    return {
      id: response.id,
      term: response.name,
    }
  } catch (error: any) {
    if (error.code !== 'term_exists') {
      throw error
    }

    return {
      id: error.data.term_id,
      term,
    }
  }
}

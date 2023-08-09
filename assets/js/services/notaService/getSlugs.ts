import { NotaService } from 'assets/js/services/types'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getSlugs: NotaService['getSlugs'] = ({ postHTML, count }) => {
  return fetch
    .post<{ result: { slugs: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_slugs',
          postHTML,
          count,
        },
      }),
    })
    .then(({ data }) => data.result)
}

import { NotaService } from 'assets/js/services/types'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getMetaTitles: NotaService['getMetaTitles'] = ({
  postHTML,
  count,
  regenerate,
}) => {
  return fetch
    .post<{ result: { metaTitles: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_meta_titles',
          postHTML,
          count,
          regenerate,
        },
      }),
    })
    .then(({ data }) => data.result)
}

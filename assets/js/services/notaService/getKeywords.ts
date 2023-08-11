import { NotaService } from 'assets/js/services/types'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getKeywords: NotaService['getKeywords'] = ({
  postHTML,
  count,
  regenerate,
}) => {
  return fetch
    .post<{ result: { keywords: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_keywords',
          postHTML,
          count,
          regenerate,
        },
      }),
    })
    .then(({ data }) => data.result)
}

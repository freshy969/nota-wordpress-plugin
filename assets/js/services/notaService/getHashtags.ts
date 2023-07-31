import { NotaService } from 'assets/js/services/types'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getHashtags: NotaService['getHashtags'] = ({
  postHTML,
  count,
}) => {
  return fetch
    .post<{ result: { hashTags: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_hashtags',
          postHTML,
          count,
        },
      }),
    })
    .then(({ data }) => {
      return data.result
    })
}

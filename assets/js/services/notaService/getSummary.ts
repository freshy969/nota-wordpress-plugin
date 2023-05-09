import { NotaService } from 'assets/js/services/types'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getSummary: NotaService['getSummary'] = ({
  postHTML,
  lengthOption,
}) => {
  return fetch
    .post<{ result: { summary: string } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_summary',
          postHTML,
          length_option: lengthOption,
        },
      }),
    })
    .then(({ data }) => data.result)
}

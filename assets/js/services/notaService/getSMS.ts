import { NotaService } from 'assets/js/services/types'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getSMS: NotaService['getSMS'] = ({
  postHTML,
  count,
  regenerate,
}) => {
  return fetch
    .post<{ result: { messages: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_sms_messages',
          postHTML,
          count,
          regenerate,
        },
      }),
    })
    .then(({ data }) => {
      const messages = data.result
      return messages
    })
}

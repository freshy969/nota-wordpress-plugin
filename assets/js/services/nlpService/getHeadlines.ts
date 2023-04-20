import { NlpService } from 'assets/js/application/ports'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getHeadlines: NlpService['getHeadlines'] = ({
  postHTML,
  count,
}) => {
  return fetch
    .post<{ result: { headlines: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_headlines',
          postHTML,
          count,
        },
      }),
    })
    .then(({ data }) => data.result)
}

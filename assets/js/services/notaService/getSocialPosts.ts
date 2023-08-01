import { SocialPosts } from 'assets/js/domain/nota'
import fetch from 'assets/js/utils/fetch/fetch'
import qs from 'qs'

export const getSocialPosts = ({
  postHTML,
  platform,
  count,
}: {
  postHTML: string
  platform: string
  count?: number
}): Promise<SocialPosts> => {
  return fetch
    .post<{ result: { posts: string[] } }>(window.notaTools.ajaxUrl, {
      data: qs.stringify({
        action: 'nota_action',
        nonce: window.notaTools.nonce,
        nota: {
          nota_action: 'get_text_social_posts',
          postHTML,
          platform,
          count,
        },
      }),
    })
    .then(({ data }) => {
      return data.result
    })
}
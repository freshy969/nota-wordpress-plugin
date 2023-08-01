import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { NotaService } from 'assets/js/services/types'

export const getSocialPostsTikTok: NotaService['getSocialPostsTikTok'] = ({
  postHTML,
  count,
}) => {
  return getSocialPosts({
    postHTML,
    platform: 'tiktok',
    count,
  })
}

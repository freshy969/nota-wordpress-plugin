import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { NotaService } from 'assets/js/services/types'

export const getSocialPostsTwitter: NotaService['getSocialPostsTwitter'] = ({
  postHTML,
  count,
}) => {
  return getSocialPosts({
    postHTML,
    platform: 'twitter',
    count,
  })
}

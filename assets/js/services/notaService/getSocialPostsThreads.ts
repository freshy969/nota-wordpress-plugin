import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { NotaService } from 'assets/js/services/types'

export const getSocialPostsThreads: NotaService['getSocialPostsThreads'] = ({
  postHTML,
  count,
}) => {
  return getSocialPosts({
    postHTML,
    platform: 'threads',
    count,
  })
}

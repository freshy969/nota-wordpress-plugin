import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { NotaService } from 'assets/js/services/types'

export const getSocialPostsInstagram: NotaService['getSocialPostsInstagram'] =
  ({ postHTML, count }) => {
    return getSocialPosts({
      postHTML,
      platform: 'instagram',
      count,
    })
  }

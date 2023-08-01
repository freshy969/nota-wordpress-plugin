import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { NotaService } from 'assets/js/services/types'

export const getSocialPostsLinkedIn: NotaService['getSocialPostsLinkedIn'] = ({
  postHTML,
  count,
}) => {
  return getSocialPosts({
    postHTML,
    platform: 'linkedIn',
    count,
  })
}

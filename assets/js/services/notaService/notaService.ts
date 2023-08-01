import { NotaService } from 'assets/js/services/types'
import { getHashtags } from 'assets/js/services/notaService/getHashtags'
import { getHeadlines } from 'assets/js/services/notaService/getHeadlines'
import { getKeywords } from 'assets/js/services/notaService/getKeywords'
import { getMetaDescriptions } from 'assets/js/services/notaService/getMetaDescriptions'
import { getMetaTitles } from 'assets/js/services/notaService/getMetaTitles'
import { getSocialPostsFacebook } from 'assets/js/services/notaService/getSocialPostsFacebook'
import { getSocialPostsInstagram } from 'assets/js/services/notaService/getSocialPostsInstagram'
import { getSocialPostsLinkedIn } from 'assets/js/services/notaService/getSocialPostsLinkedIn'
import { getSocialPostsThreads } from 'assets/js/services/notaService/getSocialPostsThreads'
import { getSocialPostsTikTok } from 'assets/js/services/notaService/getSocialPostsTikTok'
import { getSocialPostsTwitter } from 'assets/js/services/notaService/getSocialPostsTwitter'
import { getSummary } from 'assets/js/services/notaService/getSummary'

export const notaService: NotaService = {
  getHashtags,
  getHeadlines,
  getKeywords,
  getMetaDescriptions,
  getMetaTitles,
  getSocialPostsFacebook,
  getSocialPostsInstagram,
  getSocialPostsLinkedIn,
  getSocialPostsThreads,
  getSocialPostsTikTok,
  getSocialPostsTwitter,
  getSummary,
}

import { NotaService } from 'assets/js/services/types'
import { getHashtags } from 'assets/js/services/notaService/getHashtags'
import { getHeadlines } from 'assets/js/services/notaService/getHeadlines'
import { getSlugs } from 'assets/js/services/notaService/getSlugs'
import { getKeywords } from 'assets/js/services/notaService/getKeywords'
import { getMetaDescriptions } from 'assets/js/services/notaService/getMetaDescriptions'
import { getMetaTitles } from 'assets/js/services/notaService/getMetaTitles'
import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { getSummary } from 'assets/js/services/notaService/getSummary'
import { getSMS } from 'assets/js/services/notaService/getSMS'
import { withRequestThrottle } from 'assets/js/utils/throttle/withRequestThrottle'

export const notaService: NotaService = {
  getHashtags: withRequestThrottle(getHashtags),
  getHeadlines: withRequestThrottle(getHeadlines),
  getSlugs: withRequestThrottle(getSlugs),
  getKeywords: withRequestThrottle(getKeywords),
  getMetaDescriptions: withRequestThrottle(getMetaDescriptions),
  getMetaTitles: withRequestThrottle(getMetaTitles),
  getSMS: withRequestThrottle(getSMS),
  getSocialPosts: withRequestThrottle(getSocialPosts),
  getSummary: withRequestThrottle(getSummary),
}

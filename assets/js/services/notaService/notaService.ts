import { NotaService } from 'assets/js/services/types'
import { getHashtags } from 'assets/js/services/notaService/getHashtags'
import { getHeadlines } from 'assets/js/services/notaService/getHeadlines'
import { getKeywords } from 'assets/js/services/notaService/getKeywords'
import { getMetaDescriptions } from 'assets/js/services/notaService/getMetaDescriptions'
import { getMetaTitles } from 'assets/js/services/notaService/getMetaTitles'
import { getSocialPosts } from 'assets/js/services/notaService/getSocialPosts'
import { getSummary } from 'assets/js/services/notaService/getSummary'

export const notaService: NotaService = {
  getHashtags,
  getHeadlines,
  getKeywords,
  getMetaDescriptions,
  getMetaTitles,
  getSocialPosts,
  getSummary,
}

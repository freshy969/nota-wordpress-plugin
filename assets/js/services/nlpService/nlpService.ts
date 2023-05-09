import { NlpService } from 'assets/js/services/types'
import { getHeadlines } from 'assets/js/services/nlpService/getHeadlines'
import { getSummary } from 'assets/js/services/nlpService/getSummary'
import { getKeywords } from 'assets/js/services/nlpService/getKeywords'
import { getMetaDescriptions } from 'assets/js/services/nlpService/getMetaDescriptions'
import { getMetaTitles } from 'assets/js/services/nlpService/getMetaTitles'

export const nlpService: NlpService = {
  getHeadlines,
  getKeywords,
  getMetaDescriptions,
  getMetaTitles,
  getSummary,
}

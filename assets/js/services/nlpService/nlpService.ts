import { NlpService } from 'assets/js/services/types'
import { getHeadlines } from 'assets/js/services/nlpService/getHeadlines'
import { getSummary } from 'assets/js/services/nlpService/getSummary'
import { getKeywords } from 'assets/js/services/nlpService/getKeywords'

export const nlpService: NlpService = {
  getHeadlines,
  getKeywords,
  getSummary,
}

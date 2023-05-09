import { NotaService } from 'assets/js/services/types'
import { getHeadlines } from 'assets/js/services/notaService/getHeadlines'
import { getSummary } from 'assets/js/services/notaService/getSummary'
import { getKeywords } from 'assets/js/services/notaService/getKeywords'

export const notaService: NotaService = {
  getHeadlines,
  getKeywords,
  getSummary,
}

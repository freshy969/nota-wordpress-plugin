import {
  Headlines,
  HeadlinesRequest,
  Keywords,
  KeywordsRequest,
  Summary,
  SummaryRequest,
} from 'assets/js/domain/nlp'

export interface NlpService {
  getHeadlines(args: HeadlinesRequest): Promise<Headlines>
  getKeywords(args: KeywordsRequest): Promise<Keywords>
  getSummary(args: SummaryRequest): Promise<Summary>
}

interface FindOrCreateTermArgs {
  term: string
  restBase: string
  namespace: string
}
export interface WordPressService {
  findOrCreateTerm: (
    args: FindOrCreateTermArgs,
  ) => Promise<{ id: number; term: string }>
}

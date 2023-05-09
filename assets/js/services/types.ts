import {
  Headlines,
  HeadlinesRequest,
  Keywords,
  KeywordsRequest,
  MetaDescriptions,
  MetaDescriptionsRequest,
  MetaTitles,
  MetaTitlesRequest,
  Summary,
  SummaryRequest,
} from 'assets/js/domain/nlp'

export interface NlpService {
  getHeadlines(args: HeadlinesRequest): Promise<Headlines>
  getKeywords(args: KeywordsRequest): Promise<Keywords>
  getMetaDescriptions(args: MetaDescriptionsRequest): Promise<MetaDescriptions>
  getMetaTitles(args: MetaTitlesRequest): Promise<MetaTitles>
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

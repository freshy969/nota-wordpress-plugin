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
} from 'assets/js/domain/nota'

export interface NotaService {
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

interface EditMetaArgs {
  postId: number
  key: string
  value: string
}

export interface WordPressService {
  editMeta: (args: EditMetaArgs) => Promise<void>
  findOrCreateTerm: (
    args: FindOrCreateTermArgs,
  ) => Promise<{ id: number; term: string }>
}

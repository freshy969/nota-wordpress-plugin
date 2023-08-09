import {
  Hashtags,
  HashtagsRequest,
  Headlines,
  HeadlinesRequest,
  Slugs,
  SlugsRequest,
  Keywords,
  KeywordsRequest,
  MetaDescriptions,
  MetaDescriptionsRequest,
  MetaTitles,
  MetaTitlesRequest,
  SocialPosts,
  SocialPostsRequest,
  Summary,
  SummaryRequest,
  SMSRequest,
  SMSMessages,
} from 'assets/js/domain/nota'

export interface NotaService {
  getHashtags(args: HashtagsRequest): Promise<Hashtags>
  getHeadlines(args: HeadlinesRequest): Promise<Headlines>
  getSlugs(args: SlugsRequest): Promise<Slugs>
  getKeywords(args: KeywordsRequest): Promise<Keywords>
  getMetaDescriptions(args: MetaDescriptionsRequest): Promise<MetaDescriptions>
  getMetaTitles(args: MetaTitlesRequest): Promise<MetaTitles>
  getSocialPosts(args: SocialPostsRequest): Promise<SocialPosts>
  getSummary(args: SummaryRequest): Promise<Summary>
  getSMS(args: SMSRequest): Promise<SMSMessages>
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

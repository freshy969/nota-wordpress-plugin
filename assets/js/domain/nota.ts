type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedIn'
  | 'tiktok'
  | 'threads'
  | 'twitter'
type SummaryLengthOptions = '1-sentence' | '2-sentences' | '1-paragraph'

export interface Summary {
  summary: string
}

export interface SummaryRequest {
  postHTML: string
  lengthOption: SummaryLengthOptions
  regenerate?: boolean
}

export interface Hashtags {
  hashTags: string[]
}

export interface Headlines {
  headlines: string[]
}

export interface Slugs {
  slugs: string[]
}

export interface HashtagsRequest {
  postHTML: string
  regenerate?: boolean
}

export interface HeadlinesRequest {
  count?: number
  postHTML: string
  regenerate?: boolean
}

export interface SlugsRequest {
  count?: number
  postHTML: string
  regenerate?: boolean
}
export interface Keywords {
  keywords: string[]
}

export interface KeywordsRequest {
  count?: number
  postHTML: string
  regenerate?: boolean
}

export interface MetaDescriptions {
  metaDescriptions: string[]
}

export interface MetaDescriptionsRequest {
  count?: number
  postHTML: string
  regenerate?: boolean
}

export interface MetaTitles {
  metaTitles: string[]
}

export interface MetaTitlesRequest {
  count?: number
  postHTML: string
  regenerate?: boolean
}

export interface SocialPosts {
  posts: string[]
}

export interface SocialPostsRequest {
  postHTML: string
  platform: SocialPlatform
  regenerate?: boolean
}

export interface SMSMessages {
  messages: string[]
}

export interface SMSRequest {
  postHTML: string
  count?: number
  regenerate?: boolean
}

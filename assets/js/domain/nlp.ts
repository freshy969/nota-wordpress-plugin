type SummaryLengthOptions = '1-sentence' | '2-sentences' | '1-paragraph'

export interface Summary {
  summary: string
}

export interface SummaryRequest {
  postHTML: string
  lengthOption: SummaryLengthOptions
  regenerate?: boolean
}

export interface Headlines {
  headlines: string[]
}

export interface HeadlinesRequest {
  count?: number
  postHTML: string
  regenerate?: boolean
}

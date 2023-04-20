import {
  Headlines,
  HeadlinesRequest,
  Summary,
  SummaryRequest,
} from 'assets/js/domain/nlp'

export interface NlpService {
  getHeadlines(args: HeadlinesRequest): Promise<Headlines>
  getSummary(args: SummaryRequest): Promise<Summary>
}

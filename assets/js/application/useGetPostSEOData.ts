import { useMutation } from '@tanstack/react-query'
import { useCallback } from '@wordpress/element'
import { NlpService } from 'assets/js/application/ports'
import { Headlines, Summary } from 'assets/js/domain/nlp'

interface RunArgs {
  postHTML: string
}

interface Output {
  headlines: {
    isError: boolean
    isLoading: boolean
    data?: Headlines
  }
  run: (args: RunArgs) => void
  summary: {
    isError: boolean
    isLoading: boolean
    data?: Summary
  }
}

interface Args {
  nlpService: Pick<NlpService, 'getHeadlines' | 'getSummary'>
}
export const useGetPostSEOData = ({ nlpService }: Args): Output => {
  const { mutate: mutateHeadline, ...headline } = useMutation({
    mutationFn: ({ postHTML }: { postHTML: string }) => {
      return nlpService.getHeadlines({ postHTML, count: 3 })
    },
  })
  const { mutate: mutateSummary, ...summary } = useMutation({
    mutationFn: ({ postHTML }: { postHTML: string }) => {
      return nlpService.getSummary({
        postHTML,
        lengthOption: '1-sentence',
      })
    },
  })

  const run = useCallback(
    (args: RunArgs) => {
      mutateHeadline({ postHTML: args.postHTML })
      mutateSummary({ postHTML: args.postHTML })
    },
    [mutateHeadline, mutateSummary],
  )

  return {
    headlines: {
      isError: headline.isError,
      isLoading: headline.isLoading,
      data: headline.data,
    },
    run,
    summary: {
      isError: summary.isError,
      isLoading: summary.isLoading,
      data: summary.data,
    },
  }
}

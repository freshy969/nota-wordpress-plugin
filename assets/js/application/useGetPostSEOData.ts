import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from '@wordpress/element'
import { NlpService } from 'assets/js/services/types'
import { Summary } from 'assets/js/domain/nlp'

interface RunArgs {
  postHTML: string
}

interface OutputSection<TData> {
  isError: boolean
  isLoading: boolean
  data?: TData
  update: (data: TData) => void
  refresh: (args: RunArgs) => void
}

interface Output {
  headlines: OutputSection<string[]>
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
  const [headlines, setHeadlines] = useState<string[]>([])

  const { mutate: mutateHeadline, ...headline } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return nlpService.getHeadlines({ postHTML, count: 3, regenerate })
    },
    onSuccess: (data) => {
      setHeadlines(data.headlines)
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
      data: headlines,
      update: setHeadlines,
      refresh: (args: RunArgs) => {
        mutateHeadline({ postHTML: args.postHTML, regenerate: true })
      },
    },
    run,
    summary: {
      isError: summary.isError,
      isLoading: summary.isLoading,
      data: summary.data,
    },
  }
}

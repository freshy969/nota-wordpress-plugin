import { useMutation } from '@tanstack/react-query'
import { useCallback } from '@wordpress/element'
import { NotaService } from 'assets/js/services/types'
import { Summary } from 'assets/js/domain/nota'
import { History, useHistoryList } from 'assets/js/application/useHistoryList'

interface RunArgs {
  postHTML: string
}

interface OutputSection<TData> {
  isError: boolean
  isLoading: boolean
  data?: TData
  history: History
  update: (data: TData) => void
  refresh: (args: RunArgs) => void
}

interface Output {
  headlines: OutputSection<string[]>
  metaDescriptions: OutputSection<string[]>
  metaTitles: OutputSection<string[]>
  tags: OutputSection<string[]>
  run: (args: RunArgs) => void
  summary: {
    isError: boolean
    isLoading: boolean
    data?: Summary
  }
}

export type ComponentTypes =
  | 'headlines'
  | 'summary'
  | 'tags'
  | 'metaDescription'
  | 'metaTitle'

interface Args {
  notaService: Pick<
    NotaService,
    | 'getHeadlines'
    | 'getSummary'
    | 'getKeywords'
    | 'getMetaDescriptions'
    | 'getMetaTitles'
  >
  components: Record<ComponentTypes, boolean>
}
export const useGetPostSEOData = ({
  notaService,
  components,
}: Args): Output => {
  const headlines = useHistoryList<string[]>()
  const tags = useHistoryList<string[]>()
  const metaDescriptions = useHistoryList<string[]>()
  const metaTitles = useHistoryList<string[]>()

  const { mutate: mutateHeadline, ...headline } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return notaService.getHeadlines({ postHTML, count: 3, regenerate })
    },
    onSuccess: (data) => {
      headlines.addHistoryItem(data.headlines)
    },
  })
  const { mutate: mutateTags, ...tagsMutation } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return notaService.getKeywords({ postHTML, count: 10, regenerate })
    },
    onSuccess: (data) => {
      tags.addHistoryItem(data.keywords)
    },
  })
  const { mutate: mutateMetaDescriptions, ...metaDescriptionsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getMetaDescriptions({
          postHTML,
          count: 5,
          regenerate,
        })
      },
      onSuccess: (data) => {
        metaDescriptions.addHistoryItem(data.metaDescriptions)
      },
    })
  const { mutate: mutateMetaTitles, ...metaTitlesMutation } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return notaService.getMetaTitles({
        postHTML,
        count: 5,
        regenerate,
      })
    },
    onSuccess: (data) => {
      metaTitles.addHistoryItem(data.metaTitles)
    },
  })
  const { mutate: mutateSummary, ...summary } = useMutation({
    mutationFn: ({ postHTML }: { postHTML: string }) => {
      return notaService.getSummary({
        postHTML,
        lengthOption: '1-sentence',
      })
    },
  })

  const run = useCallback(
    (args: RunArgs) => {
      const componentMutations: Record<string, () => void> = {
        headlines: () => mutateHeadline({ postHTML: args.postHTML }),
        summary: () => mutateSummary({ postHTML: args.postHTML }),
        tags: () => mutateTags({ postHTML: args.postHTML }),
        metaDescription: () =>
          mutateMetaDescriptions({ postHTML: args.postHTML }),
        metaTitle: () => mutateMetaTitles({ postHTML: args.postHTML }),
      }
      Object.entries(components).forEach(([component, shouldRun]) => {
        if (!shouldRun) return
        componentMutations[component]?.()
      })
    },
    [
      mutateHeadline,
      mutateSummary,
      mutateTags,
      mutateMetaDescriptions,
      mutateMetaTitles,
      components,
    ],
  )

  return {
    headlines: {
      isError: headline.isError,
      isLoading: headline.isLoading,
      ...headlines,
      refresh: (args: RunArgs) => {
        mutateHeadline({ postHTML: args.postHTML, regenerate: true })
      },
    },
    metaDescriptions: {
      isError: metaDescriptionsMutation.isError,
      isLoading: metaDescriptionsMutation.isLoading,
      ...metaDescriptions,
      refresh: (args: RunArgs) => {
        mutateMetaDescriptions({ postHTML: args.postHTML, regenerate: true })
      },
    },
    metaTitles: {
      isError: metaTitlesMutation.isError,
      isLoading: metaTitlesMutation.isLoading,
      ...metaTitles,
      refresh: (args: RunArgs) => {
        mutateMetaTitles({ postHTML: args.postHTML, regenerate: true })
      },
    },
    run,
    summary: {
      isError: summary.isError,
      isLoading: summary.isLoading,
      data: summary.data,
    },
    tags: {
      isError: tagsMutation.isError,
      isLoading: tagsMutation.isLoading,
      ...tags,
      refresh: (args: RunArgs) => {
        mutateTags({ postHTML: args.postHTML, regenerate: true })
      },
    },
  }
}

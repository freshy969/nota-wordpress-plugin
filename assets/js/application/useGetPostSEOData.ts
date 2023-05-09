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
  metaDescriptions: OutputSection<string[]>
  tags: OutputSection<string[]>
  run: (args: RunArgs) => void
  summary: {
    isError: boolean
    isLoading: boolean
    data?: Summary
  }
}

type ComponentTypes = 'headlines' | 'summary' | 'tags' | 'metaDescription'

interface Args {
  nlpService: Pick<
    NlpService,
    'getHeadlines' | 'getSummary' | 'getKeywords' | 'getMetaDescriptions'
  >
  components: Record<ComponentTypes, boolean>
}
export const useGetPostSEOData = ({ nlpService, components }: Args): Output => {
  const [headlines, setHeadlines] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [metaDescriptions, setMetaDescriptions] = useState<string[]>([])

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
  const { mutate: mutateTags, ...tagsMutation } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return nlpService.getKeywords({ postHTML, count: 10, regenerate })
    },
    onSuccess: (data) => {
      setTags(data.keywords)
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
        return nlpService.getMetaDescriptions({
          postHTML,
          count: 5,
          regenerate,
        })
      },
      onSuccess: (data) => {
        setMetaDescriptions(data.metaDescriptions)
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
      const componentMutations: Record<string, () => void> = {
        headlines: () => mutateHeadline({ postHTML: args.postHTML }),
        summary: () => mutateSummary({ postHTML: args.postHTML }),
        tags: () => mutateTags({ postHTML: args.postHTML }),
        metaDescription: () =>
          mutateMetaDescriptions({ postHTML: args.postHTML }),
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
      components,
    ],
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
    metaDescriptions: {
      isError: metaDescriptionsMutation.isError,
      isLoading: metaDescriptionsMutation.isLoading,
      data: metaDescriptions,
      update: setMetaDescriptions,
      refresh: (args: RunArgs) => {
        mutateMetaDescriptions({ postHTML: args.postHTML, regenerate: true })
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
      data: tags,
      update: setTags,
      refresh: (args: RunArgs) => {
        mutateTags({ postHTML: args.postHTML, regenerate: true })
      },
    },
  }
}

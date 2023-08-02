import { useMutation } from '@tanstack/react-query'
import { useCallback } from '@wordpress/element'
import { NotaService } from 'assets/js/services/types'
import { History, useHistoryList } from 'assets/js/application/useHistoryList'

interface RunArgs {
  postHTML: string
}

interface OutputSection<TData> {
  error: unknown
  isLoading: boolean
  data?: TData
  history: History
  update: (data: TData) => void
  refresh: (args: RunArgs) => void
}

interface Output {
  excerpt: OutputSection<string[]>
  hashtags: OutputSection<string[]>
  headlines: OutputSection<string[]>
  metaDescriptions: OutputSection<string[]>
  metaTitles: OutputSection<string[]>
  socialPostsFacebook: OutputSection<string[]>
  socialPostsInstagram: OutputSection<string[]>
  socialPostsLinkedIn: OutputSection<string[]>
  socialPostsThreads: OutputSection<string[]>
  socialPostsTikTok: OutputSection<string[]>
  socialPostsTwitter: OutputSection<string[]>
  tags: OutputSection<string[]>
  run: (args: RunArgs) => void
}

export type ComponentTypes =
  | 'excerpt'
  | 'hashtags'
  | 'headlines'
  | 'tags'
  | 'metaDescriptions'
  | 'metaTitles'
  | 'socialPostsFacebook'
  | 'socialPostsInstagram'
  | 'socialPostsLinkedIn'
  | 'socialPostsThreads'
  | 'socialPostsTikTok'
  | 'socialPostsTwitter'

interface Args {
  notaService: Pick<
    NotaService,
    | 'getHashtags'
    | 'getHeadlines'
    | 'getKeywords'
    | 'getMetaDescriptions'
    | 'getMetaTitles'
    | 'getSocialPosts'
    | 'getSummary'
  >
  components: Record<ComponentTypes, boolean>
}
export const useGetPostSEOData = ({
  notaService,
  components,
}: Args): Output => {
  const metaKeys = window.notaTools.meta_keys
  const excerpts = useHistoryList<string[]>({ key: metaKeys.excerpt_history })
  const hashtags = useHistoryList<string[]>({
    key: metaKeys.social_hashtags_history,
  })
  const headlines = useHistoryList<string[]>({ key: metaKeys.headline_history })
  const tags = useHistoryList<string[]>({ key: metaKeys.tag_history })
  const metaDescriptions = useHistoryList<string[]>({
    key: metaKeys.seo_desc_history,
  })
  const metaTitles = useHistoryList<string[]>({
    key: metaKeys.seo_title_history,
  })
  const socialPostsFacebook = useHistoryList<string[]>({
    key: metaKeys.social_post_facebook_history,
  })
  const socialPostsInstagram = useHistoryList<string[]>({
    key: metaKeys.social_post_instagram_history,
  })
  const socialPostsLinkedIn = useHistoryList<string[]>({
    key: metaKeys.social_post_linkedin_history,
  })
  const socialPostsThreads = useHistoryList<string[]>({
    key: metaKeys.social_post_threads_history,
  })
  const socialPostsTikTok = useHistoryList<string[]>({
    key: metaKeys.social_post_tiktok_history,
  })
  const socialPostsTwitter = useHistoryList<string[]>({
    key: metaKeys.social_post_twitter_history,
  })

  const { mutate: mutateHashtags, ...hashtagsMutation } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return notaService.getHashtags({ postHTML, regenerate })
    },
    onSuccess: (data) => {
      hashtags.addHistoryItem(data.hashTags)
    },
  })
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
  const { mutate: mutateSocialPostsFacebook, ...facebookPostsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getSocialPosts({
          postHTML,
          platform: 'facebook',
          regenerate,
        })
      },
      onSuccess: (data) => {
        socialPostsFacebook.addHistoryItem(data.posts)
      },
    })
  const { mutate: mutateSocialPostsInstagram, ...instagramPostsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getSocialPosts({
          postHTML,
          platform: 'instagram',
          regenerate,
        })
      },
      onSuccess: (data) => {
        socialPostsInstagram.addHistoryItem(data.posts)
      },
    })
  const { mutate: mutateSocialPostsLinkedIn, ...linkedInPostsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getSocialPosts({
          postHTML,
          platform: 'linkedIn',
          regenerate,
        })
      },
      onSuccess: (data) => {
        socialPostsLinkedIn.addHistoryItem(data.posts)
      },
    })
  const { mutate: mutateSocialPostsThreads, ...threadsPostsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getSocialPosts({
          postHTML,
          platform: 'threads',
          regenerate,
        })
      },
      onSuccess: (data) => {
        socialPostsThreads.addHistoryItem(data.posts)
      },
    })
  const { mutate: mutateSocialPostsTikTok, ...tiktokPostsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getSocialPosts({
          postHTML,
          platform: 'tiktok',
          regenerate,
        })
      },
      onSuccess: (data) => {
        socialPostsTikTok.addHistoryItem(data.posts)
      },
    })
  const { mutate: mutateSocialPostsTwitter, ...twitterPostsMutation } =
    useMutation({
      mutationFn: ({
        postHTML,
        regenerate,
      }: {
        postHTML: string
        regenerate?: boolean
      }) => {
        return notaService.getSocialPosts({
          postHTML,
          platform: 'twitter',
          regenerate,
        })
      },
      onSuccess: (data) => {
        socialPostsTwitter.addHistoryItem(data.posts)
      },
    })
  const { mutate: mutateSummary, ...summary } = useMutation({
    mutationFn: ({
      postHTML,
      regenerate,
    }: {
      postHTML: string
      regenerate?: boolean
    }) => {
      return notaService.getSummary({
        postHTML,
        lengthOption: '1-sentence',
        regenerate,
      })
    },
    onSuccess: (data) => {
      excerpts.addHistoryItem([data.summary])
    },
  })

  const run = useCallback(
    (args: RunArgs) => {
      const componentMutations: Record<ComponentTypes, () => void> = {
        hashtags: () => mutateHashtags({ postHTML: args.postHTML }),
        headlines: () => mutateHeadline({ postHTML: args.postHTML }),
        excerpt: () => mutateSummary({ postHTML: args.postHTML }),
        tags: () => mutateTags({ postHTML: args.postHTML }),
        metaDescriptions: () =>
          mutateMetaDescriptions({ postHTML: args.postHTML }),
        metaTitles: () => mutateMetaTitles({ postHTML: args.postHTML }),
        socialPostsFacebook: () =>
          mutateSocialPostsFacebook({ postHTML: args.postHTML }),
        socialPostsInstagram: () =>
          mutateSocialPostsInstagram({ postHTML: args.postHTML }),
        socialPostsLinkedIn: () =>
          mutateSocialPostsLinkedIn({ postHTML: args.postHTML }),
        socialPostsThreads: () =>
          mutateSocialPostsThreads({ postHTML: args.postHTML }),
        socialPostsTikTok: () =>
          mutateSocialPostsTikTok({ postHTML: args.postHTML }),
        socialPostsTwitter: () =>
          mutateSocialPostsTwitter({ postHTML: args.postHTML }),
      }
      const componentKeys = Object.keys(components) as ComponentTypes[]
      componentKeys.forEach((component) => {
        if (!components[component]) return
        componentMutations[component]?.()
      })
    },
    [
      mutateHashtags,
      mutateHeadline,
      mutateSummary,
      mutateTags,
      mutateMetaDescriptions,
      mutateMetaTitles,
      mutateSocialPostsFacebook,
      mutateSocialPostsInstagram,
      mutateSocialPostsLinkedIn,
      mutateSocialPostsThreads,
      mutateSocialPostsTikTok,
      mutateSocialPostsTwitter,
      components,
    ],
  )

  return {
    hashtags: {
      error: hashtagsMutation.error,
      isLoading: hashtagsMutation.isLoading,
      ...hashtags,
      refresh: (args: RunArgs) => {
        mutateHashtags({ postHTML: args.postHTML, regenerate: true })
      },
    },
    headlines: {
      error: headline.error,
      isLoading: headline.isLoading,
      ...headlines,
      refresh: (args: RunArgs) => {
        mutateHeadline({ postHTML: args.postHTML, regenerate: true })
      },
    },
    metaDescriptions: {
      error: metaDescriptionsMutation.error,
      isLoading: metaDescriptionsMutation.isLoading,
      ...metaDescriptions,
      refresh: (args: RunArgs) => {
        mutateMetaDescriptions({ postHTML: args.postHTML, regenerate: true })
      },
    },
    metaTitles: {
      error: metaTitlesMutation.error,
      isLoading: metaTitlesMutation.isLoading,
      ...metaTitles,
      refresh: (args: RunArgs) => {
        mutateMetaTitles({ postHTML: args.postHTML, regenerate: true })
      },
    },
    run,
    excerpt: {
      error: summary.error,
      isLoading: summary.isLoading,
      ...excerpts,
      refresh: (args: RunArgs) => {
        mutateSummary({ postHTML: args.postHTML, regenerate: true })
      },
    },
    tags: {
      error: tagsMutation.error,
      isLoading: tagsMutation.isLoading,
      ...tags,
      refresh: (args: RunArgs) => {
        mutateTags({ postHTML: args.postHTML, regenerate: true })
      },
    },
    socialPostsFacebook: {
      error: facebookPostsMutation.error,
      isLoading: facebookPostsMutation.isLoading,
      ...socialPostsFacebook,
      refresh: (args: RunArgs) => {
        mutateSocialPostsFacebook({ postHTML: args.postHTML, regenerate: true })
      },
    },
    socialPostsInstagram: {
      error: instagramPostsMutation.error,
      isLoading: instagramPostsMutation.isLoading,
      ...socialPostsInstagram,
      refresh: (args: RunArgs) => {
        mutateSocialPostsInstagram({
          postHTML: args.postHTML,
          regenerate: true,
        })
      },
    },
    socialPostsLinkedIn: {
      error: linkedInPostsMutation.error,
      isLoading: linkedInPostsMutation.isLoading,
      ...socialPostsLinkedIn,
      refresh: (args: RunArgs) => {
        mutateSocialPostsLinkedIn({ postHTML: args.postHTML, regenerate: true })
      },
    },
    socialPostsThreads: {
      error: threadsPostsMutation.error,
      isLoading: threadsPostsMutation.isLoading,
      ...socialPostsThreads,
      refresh: (args: RunArgs) => {
        mutateSocialPostsThreads({ postHTML: args.postHTML, regenerate: true })
      },
    },
    socialPostsTikTok: {
      error: tiktokPostsMutation.error,
      isLoading: tiktokPostsMutation.isLoading,
      ...socialPostsTikTok,
      refresh: (args: RunArgs) => {
        mutateSocialPostsTikTok({ postHTML: args.postHTML, regenerate: true })
      },
    },
    socialPostsTwitter: {
      error: twitterPostsMutation.error,
      isLoading: twitterPostsMutation.isLoading,
      ...socialPostsTwitter,
      refresh: (args: RunArgs) => {
        mutateSocialPostsTwitter({ postHTML: args.postHTML, regenerate: true })
      },
    },
  }
}

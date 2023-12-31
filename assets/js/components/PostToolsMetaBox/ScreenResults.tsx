import {
  ComponentTypes,
  useGetPostSEOData,
} from 'assets/js/application/useGetPostSEOData'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from '@wordpress/element'
import { TextOptionList } from 'assets/js/components/TextOptionList/TextOptionList'
import { useEditPostData } from 'assets/js/application/useEditPostData'
import { useEditMetadata } from 'assets/js/application/useEditMetadata'
import { Button } from 'assets/js/components/Button/Button'
import { TagCloud } from 'assets/js/components/TagCloud/TagCloud'
import { TagSelect } from 'assets/js/components/TagSelect/TagSelect'
import { SectionHeading } from 'assets/js/components/SectionHeading/SectionHeading'
import { Preview } from 'assets/js/components/PostToolsMetaBox/Preview'

interface TabLabelProps {
  children: React.ReactNode
}
function TabLabel({ children }: TabLabelProps) {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={clsx('relative ntw-text-paragraph-large', {
            'ntw-text-button-default': selected,
            'ntw-text-typography-disabled hover:ntw-text-button-hover':
              !selected,
          })}
        >
          {children}
          <span
            className={clsx(
              'ntw-absolute -ntw-bottom-2px ntw-block ntw-h-2px ntw-w-full ntw-bg-button-default',
              {
                'ntw-opacity-0': !selected,
              },
            )}
          />
        </button>
      )}
    </Tab>
  )
}

interface Props {
  seoData: ReturnType<typeof useGetPostSEOData>
  components: Record<ComponentTypes, boolean>
  postHTML: string
  onTabChange: (tab: string) => void
  onReanalyze: () => void
}

export function ScreenResults({
  seoData,
  components,
  postHTML,
  onTabChange,
  onReanalyze,
}: Props) {
  const {
    editPostTitle,
    editPostExcerpt,
    editPostSlug,
    postTitle,
    postExcerpt,
    postSlug,
    revertTitle,
    revertExcerpt,
    revertSlug,
  } = useEditPostData()
  const {
    editMetaDescription,
    editMetaTitle,
    metaTitle,
    metaDescription,
    revertMetaDescription,
    revertMetaTitle,
  } = useEditMetadata()
  return (
    <div>
      <div className="ntw-mb-24px ntw-flex ntw-items-center ntw-justify-between">
        <div className="ntw-text-h-900">Welcome to Nota</div>
        <div className="ntw-flex-shrink-0">
          <Button variant="secondary" size={300} onClick={onReanalyze}>
            Reanalyze page
          </Button>
        </div>
      </div>
      <div className="ntw-rounded-2xl ntw-p-24px ntw-shadow">
        <Tab.Group
          onChange={(index) => {
            const nextTab = ['content', 'seo', 'social'][index]
            onTabChange(nextTab)
          }}
        >
          <Tab.List className="ntw-mb-32px ntw-space-x-24px">
            <TabLabel>Content</TabLabel>
            <TabLabel>SEO</TabLabel>
            <TabLabel>Social</TabLabel>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="ntw-space-y-32px">
                <TextOptionList
                  title="Headlines"
                  subtitle="Select a headline to use on the page"
                  isLoading={seoData.headlines.isLoading}
                  error={seoData.headlines.error}
                  options={seoData.headlines.data}
                  onSelect={editPostTitle}
                  updateOptions={seoData.headlines.update}
                  onRefresh={() =>
                    seoData.headlines.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.headlines.history}
                  currentValue={postTitle}
                  onRevert={revertTitle}
                />

                <TextOptionList
                  title="Excerpt"
                  subtitle="Select an excerpt to use on the page"
                  isLoading={seoData.excerpt.isLoading}
                  error={seoData.excerpt.error}
                  options={seoData.excerpt.data}
                  onSelect={editPostExcerpt}
                  updateOptions={seoData.excerpt.update}
                  onRefresh={() =>
                    seoData.excerpt.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.excerpt.history}
                  currentValue={postExcerpt}
                  onRevert={revertExcerpt}
                />

                {components.tags && (
                  <TagSelect
                    title="Tags"
                    subtitle="Select the tags you want to use on this page"
                    history={seoData.tags.history}
                    isLoading={seoData.tags.isLoading}
                    error={seoData.tags.error}
                    tags={seoData.tags.data}
                    onRefresh={() =>
                      seoData.tags.refresh({
                        postHTML,
                      })
                    }
                  />
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="ntw-space-y-32px">
                <TextOptionList
                  title="Page Title"
                  subtitle="Select a page title to use in your page"
                  isLoading={seoData.metaTitles.isLoading}
                  error={seoData.metaTitles.error}
                  options={seoData.metaTitles.data}
                  onSelect={editMetaTitle}
                  updateOptions={seoData.metaTitles.update}
                  onRefresh={() =>
                    seoData.metaTitles.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.metaTitles.history}
                  disabled={!components.metaTitles}
                  disabledMessage="Enabled Yoast to get meta title recommendations."
                  currentValue={metaTitle}
                  onRevert={revertMetaTitle}
                />
                <TextOptionList
                  title="Slugs"
                  subtitle="Select a slug to use on the page"
                  isLoading={seoData.slugs.isLoading}
                  error={seoData.slugs.error}
                  options={seoData.slugs.data}
                  onSelect={editPostSlug}
                  updateOptions={seoData.slugs.update}
                  onRefresh={() =>
                    seoData.slugs.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.slugs.history}
                  currentValue={postSlug}
                  onRevert={revertSlug}
                />
                <TextOptionList
                  title="Meta Description"
                  subtitle="Select a meta description to use in your page"
                  isLoading={seoData.metaDescriptions.isLoading}
                  error={seoData.metaDescriptions.error}
                  options={seoData.metaDescriptions.data}
                  onSelect={editMetaDescription}
                  updateOptions={seoData.metaDescriptions.update}
                  onRefresh={() =>
                    seoData.metaDescriptions.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.metaDescriptions.history}
                  disabled={!components.metaDescriptions}
                  disabledMessage="Enabled Yoast to get meta description recommendations."
                  currentValue={metaDescription}
                  onRevert={revertMetaDescription}
                />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="ntw-space-y-32px">
                {components.socialPostsFacebook && (
                  <TextOptionList
                    title="Facebook"
                    subtitle="Recommended Facebook posts"
                    isLoading={seoData.socialPostsFacebook.isLoading}
                    error={seoData.socialPostsFacebook.error}
                    options={seoData.socialPostsFacebook.data}
                    updateOptions={seoData.socialPostsFacebook.update}
                    onRefresh={() =>
                      seoData.socialPostsFacebook.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.socialPostsFacebook.history}
                  />
                )}
                {components.socialPostsInstagram && (
                  <TextOptionList
                    title="Instagram"
                    subtitle="Recommended Instagram posts"
                    isLoading={seoData.socialPostsInstagram.isLoading}
                    error={seoData.socialPostsInstagram.error}
                    options={seoData.socialPostsInstagram.data}
                    updateOptions={seoData.socialPostsInstagram.update}
                    onRefresh={() =>
                      seoData.socialPostsInstagram.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.socialPostsInstagram.history}
                  />
                )}
                {components.socialPostsTwitter && (
                  <TextOptionList
                    title="X (formerly Twitter)"
                    subtitle="Recommended X posts"
                    isLoading={seoData.socialPostsTwitter.isLoading}
                    error={seoData.socialPostsTwitter.error}
                    options={seoData.socialPostsTwitter.data}
                    updateOptions={seoData.socialPostsTwitter.update}
                    onRefresh={() =>
                      seoData.socialPostsTwitter.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.socialPostsTwitter.history}
                  />
                )}
                {components.socialPostsThreads && (
                  <TextOptionList
                    title="Threads"
                    subtitle="Recommended Threads posts"
                    isLoading={seoData.socialPostsThreads.isLoading}
                    error={seoData.socialPostsThreads.error}
                    options={seoData.socialPostsThreads.data}
                    updateOptions={seoData.socialPostsThreads.update}
                    onRefresh={() =>
                      seoData.socialPostsThreads.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.socialPostsThreads.history}
                  />
                )}
                {components.socialPostsLinkedIn && (
                  <TextOptionList
                    title="LinkedIn"
                    subtitle="Recommended LinkedIn posts"
                    isLoading={seoData.socialPostsLinkedIn.isLoading}
                    error={seoData.socialPostsLinkedIn.error}
                    options={seoData.socialPostsLinkedIn.data}
                    updateOptions={seoData.socialPostsLinkedIn.update}
                    onRefresh={() =>
                      seoData.socialPostsLinkedIn.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.socialPostsLinkedIn.history}
                  />
                )}
                {components.socialPostsTikTok && (
                  <TextOptionList
                    title="TikTok"
                    subtitle="Recommended TikTok posts"
                    isLoading={seoData.socialPostsTikTok.isLoading}
                    error={seoData.socialPostsTikTok.error}
                    options={seoData.socialPostsTikTok.data}
                    updateOptions={seoData.socialPostsTikTok.update}
                    onRefresh={() =>
                      seoData.socialPostsTikTok.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.socialPostsTikTok.history}
                  />
                )}
                {components.sms && (
                  <TextOptionList
                    title="SMS"
                    subtitle="Recommended SMS messages"
                    isLoading={seoData.sms.isLoading}
                    error={seoData.sms.error}
                    options={seoData.sms.data}
                    updateOptions={seoData.sms.update}
                    onRefresh={() =>
                      seoData.sms.refresh({
                        postHTML,
                      })
                    }
                    history={seoData.sms.history}
                  />
                )}
                {components.hashtags && (
                  <TagCloud
                    title="Hashtags"
                    subtitle="Recommended hashtags"
                    history={seoData.hashtags.history}
                    isLoading={seoData.hashtags.isLoading}
                    error={seoData.hashtags.error}
                    tags={seoData.hashtags.data}
                    onRefresh={() =>
                      seoData.hashtags.refresh({
                        postHTML,
                      })
                    }
                  />
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="ntw-mt-24px ntw-rounded-2xl ntw-p-24px ntw-shadow">
        <SectionHeading
          title="Preview"
          subtitle="See below a preview of your page settings"
          className="ntw-mb-32px"
        />
        <Preview />
      </div>
    </div>
  )
}

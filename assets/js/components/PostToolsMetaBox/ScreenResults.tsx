import {
  ComponentTypes,
  useGetPostSEOData,
} from 'assets/js/application/useGetPostSEOData'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from '@wordpress/element'
import { TextOptionList } from 'assets/js/components/TextOptionList/TextOptionList'
import { useEditPostTitle } from 'assets/js/application/useEditPostTitle'
import { useEditMetadata } from 'assets/js/application/useEditMetadata'
import { useAddTaxonomy } from 'assets/js/application/useAddTaxonomy'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'
import { Button } from 'assets/js/components/Button/Button'

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
              'ntw-absolute ntw-top-full ntw-block ntw-h-2px ntw-w-full ntw-bg-button-default',
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
}

export function ScreenResults({ seoData, components, postHTML }: Props) {
  const editPostTitle = useEditPostTitle()
  const { editMetaDescription, editMetaTitle } = useEditMetadata()
  const addTag = useAddTaxonomy({
    taxonomy: 'post_tag',
    wpService: wordPressService,
  })
  return (
    <div>
      <div className="ntw-mb-24px ntw-flex ntw-items-center ntw-justify-between">
        <div className="ntw-text-h-900">Welcome to Nota</div>
        <div className="ntw-flex-shrink-0">
          <Button
            variant="secondary"
            size={300}
            onClick={() => {
              // run re-analysis
            }}
          >
            Reanalyze page
          </Button>
        </div>
      </div>
      <div className="ntw-rounded-2xl ntw-p-24px ntw-shadow">
        <Tab.Group>
          <Tab.List className="ntw-mb-32px ntw-space-x-24px">
            <TabLabel>Content settings</TabLabel>
            <TabLabel>SEO settings</TabLabel>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="ntw-space-y-32px">
                <TextOptionList
                  title="Headlines"
                  subtitle="Select a headline to use on the page"
                  isLoading={seoData.headlines.isLoading}
                  hasError={seoData.headlines.isError}
                  options={seoData.headlines.data}
                  onSelect={editPostTitle}
                  updateOptions={seoData.headlines.update}
                  onRefresh={() =>
                    seoData.headlines.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.headlines.history}
                />

                {components.summary && (
                  <div>
                    <h3 className="ntw-mb-2 ntw-mt-0 ntw-text-lg ntw-font-bold">
                      Summary
                    </h3>
                    {seoData.summary.isLoading ? (
                      'Loading...'
                    ) : (
                      <div>
                        {seoData.summary.isError ? (
                          <div>There was an error</div>
                        ) : (
                          <div>
                            {seoData.summary.data?.summary || 'No summary'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {components.tags && (
                  <TextOptionList
                    title="Tags"
                    subtitle="Select the tags you want to use on this page"
                    isLoading={seoData.tags.isLoading}
                    hasError={seoData.tags.isError}
                    options={seoData.tags.data}
                    onSelect={addTag}
                    updateOptions={seoData.tags.update}
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
                  hasError={seoData.metaTitles.isError}
                  options={seoData.metaTitles.data}
                  onSelect={editMetaTitle}
                  updateOptions={seoData.metaTitles.update}
                  onRefresh={() =>
                    seoData.metaTitles.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.metaTitles.history}
                  disabled={!components.metaTitle}
                  disabledMessage="Enabled Yoast to get meta title recommendations."
                />
                <TextOptionList
                  title="Meta Description"
                  subtitle="Select a meta description to use in your page"
                  isLoading={seoData.metaDescriptions.isLoading}
                  hasError={seoData.metaDescriptions.isError}
                  options={seoData.metaDescriptions.data}
                  onSelect={editMetaDescription}
                  updateOptions={seoData.metaDescriptions.update}
                  onRefresh={() =>
                    seoData.metaDescriptions.refresh({
                      postHTML,
                    })
                  }
                  history={seoData.metaDescriptions.history}
                  disabled={!components.metaDescription}
                  disabledMessage="Enabled Yoast to get meta description recommendations."
                />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

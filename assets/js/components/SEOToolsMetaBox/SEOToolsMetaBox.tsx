import { PluginDocumentSettingPanel } from '@wordpress/edit-post'
import { MetaTextInput } from 'assets/js/components/MetaTextInput/MetaTextInput'

export function SEOToolsMetaBox() {
  return (
    <PluginDocumentSettingPanel name="nota-seo-tools" title="Nota SEO Tools">
      <MetaTextInput
        metaKey={window.notaTools.meta_keys.seo_title}
        label="SEO Title"
      />
      <MetaTextInput
        metaKey={window.notaTools.meta_keys.seo_desc}
        label="SEO Description"
      />
    </PluginDocumentSettingPanel>
  )
}

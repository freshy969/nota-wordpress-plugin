import 'assets/css/styles.css'
import { createRoot, render, createElement } from '@wordpress/element'
import { PostToolsMetaBox } from 'assets/js/components/PostToolsMetaBox/PostToolsMetaBox'

const init = () => {
  const domElement = document.getElementById('nota-post-tools-meta-box-root')
  if (!domElement) {
    // eslint-disable-next-line no-console -- This should never happen, but helpful for devs if it does
    console.log(
      'Failing to render Nota Post Tools Meta Box as element does not exist',
    )
    return
  }
  const uiElement = createElement(PostToolsMetaBox)
  if (createRoot) {
    createRoot(domElement).render(uiElement)
  } else {
    render(uiElement, domElement)
  }
}
init()

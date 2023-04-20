import 'assets/css/styles.css'
import { createRoot, render, createElement } from '@wordpress/element'
import { PostToolsMetaBox } from 'assets/js/components/PostToolsMetaBox'

console.log('this is running')

const init = () => {
  const domElement = document.getElementById('nota-post-tools-meta-box-root')
  const uiElement = createElement(PostToolsMetaBox)
  if (!domElement) {
    console.log(
      'Failing to render Nota Post Tools Meta Box as element does not exist',
    )
    return
  }
  if (createRoot) {
    createRoot(domElement).render(uiElement)
  } else {
    render(uiElement, domElement)
  }
}
init()

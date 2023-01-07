import Renderer from '../renderer'

const SELECTORS = {
  root: '#root',
}

export default class PageController<PageProps extends object> {
  private HTMLRootElement = document.querySelector(SELECTORS.root)
  private HTMLTemplate = ''

  constructor(private template: string) {
    return this
  }

  render(props: PageProps) {
    if (Renderer && this.HTMLRootElement) {
      this.HTMLRootElement.innerHTML = Renderer.toHTML(this.template, props)
    }

    return this.HTMLTemplate
  }
}

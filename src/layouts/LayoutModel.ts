import Renderer from 'renderer/Renderer'

export type BaseModelType = {
  title: string
}

const SELECTORS = {
  root: '#root',
}

export default class LayoutModel<ModelType extends BaseModelType> {
  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  constructor(
    public pathname: string,
    public pageTitle: string,
    private layout: string,
    private model: ModelType
  ) {
    return this
  }

  private setPageTitle() {
    document.title = this.pageTitle
  }

  public render() {
    this.setPageTitle()
    this.HTMLRootElement.innerHTML = Renderer.toHTML(this.layout, this.model)
  }
}

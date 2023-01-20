import Renderer from 'renderer/Renderer'
import { BaseModule } from 'core/index'

export type BaseModelType = {
  title: string
}

const SELECTORS = {
  root: '#root',
}

export default class LayoutModel<
  ModelType extends BaseModelType
> extends BaseModule {
  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  constructor(
    public pathname: string,
    public pageTitle: string,
    private layout: string,
    private model: ModelType
  ) {
    super()

    return this
  }

  private setPageTitle() {
    document.title = this.pageTitle
  }

  public render() {
    this.setPageTitle()
    this.HTMLRootElement.innerHTML = Renderer.toHTML(this.layout, this.model)
  }

  public getRootElement() {
    return this.HTMLRootElement
  }
}

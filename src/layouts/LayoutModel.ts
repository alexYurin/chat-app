import Renderer from 'renderer/Renderer'
import BaseModel, { BaseModelType } from 'layouts/BaseModel'
import { BaseLayoutProps } from 'layouts/BaseLayout'
import { BaseModule } from 'core/index'

const SELECTORS = {
  root: '#root',
}

export default class LayoutModel<
  ModelType extends BaseModel<BaseLayoutProps, BaseModelType>
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

    console.log('model', this.model)

    if (Object.keys(this.model).length === 0) {
      return
    }

    this.HTMLRootElement.innerHTML = Renderer.toHTML(
      this.layout,
      this.model.stringifyComponents()
    )

    setTimeout(() => {
      this.model.mountComponents()
    })
  }

  public getRootElement() {
    return this.HTMLRootElement
  }
}

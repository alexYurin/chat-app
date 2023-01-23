import Renderer from 'renderer/Renderer'
import BaseModel, { BaseModelType } from 'layouts/BaseModel'
import { BaseLayoutProps } from 'layouts/BaseLayout'
import { BaseModule } from 'core/index'

const SELECTORS = {
  root: '#root',
}

export default class LayoutController<
  ModelType extends BaseModel<BaseLayoutProps, BaseModelType>
> extends BaseModule {
  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  constructor(
    public pathname: string,
    public pageTitle: string,
    protected layout: string,
    protected modelInstance: ModelType
  ) {
    super()

    return this
  }

  private setPageTitle() {
    document.title = this.pageTitle
  }

  public render() {
    this.setPageTitle()

    if (Object.keys(this.modelInstance).length === 0) {
      return
    }

    this.HTMLRootElement.innerHTML = Renderer.toHTML(
      this.layout,
      this.modelInstance.createComponents()
    )

    setTimeout(() => {
      this.modelInstance.mountComponents()
    })
  }

  public getRootElement() {
    return this.HTMLRootElement
  }
}

import Renderer from 'renderer/Renderer'
import BaseModel, { BaseModelType } from 'core/BaseModel'
import { BaseComponent } from 'core/index'
import { BaseComponentProps, BaseComponentOptions } from 'core/BaseComponent'

const SELECTORS = {
  root: '#root',
}

export interface BaseControllerProps extends BaseComponentProps {
  pathname: string
  screenTitle: string
}

export type ModelInstanceType = BaseModel<BaseControllerProps, BaseModelType>

export default abstract class BaseController extends BaseComponent<BaseControllerProps> {
  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  protected modelInstance: ModelInstanceType = {} as ModelInstanceType

  constructor(
    name: string,
    props: BaseControllerProps,
    options: BaseComponentOptions
  ) {
    super(name, props, options)
  }

  private setScreenTitle() {
    document.title = this.props.screenTitle
  }

  public render() {
    this.setScreenTitle()

    this.HTMLRootElement.innerHTML = Renderer.toHTML(
      this.template,
      this.modelInstance.createComponents()
    )

    setTimeout(() => {
      this.modelInstance.mountComponents()
    })
  }
}

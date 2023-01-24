import Templator from 'templators/index'
import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index'

const SELECTORS = {
  root: '#root',
}

export type BaseLayoutMapType = {
  title: string | BaseComponent<BaseComponentProps>
}

export interface BaseLayoutProps extends BaseComponentProps {
  pathname: string
  documentTitle: string
}

export type BaseLayoutParamsType<TLayoutProps> = {
  name: string
  props: TLayoutProps & BaseLayoutProps
  options?: BaseComponentOptions
}

export default abstract class BaseLayout<
  TLayoutProps extends BaseLayoutProps,
  TLayoutMap extends BaseLayoutMapType
> extends BaseComponent<TLayoutProps> {
  constructor(params: BaseLayoutParamsType<TLayoutProps>) {
    super(params.name, params.props, params.options)

    this.init()
  }

  protected abstract init(): void

  protected map: TLayoutMap = {} as TLayoutMap

  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  public render() {
    document.title = this.props.documentTitle

    this.HTMLRootElement.innerHTML = Templator.compile(
      this.template,
      this.props
    )

    this.componentRender()
  }
}

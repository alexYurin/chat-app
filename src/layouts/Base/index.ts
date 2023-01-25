import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index'

const SELECTORS = {
  root: '#root',
}

export type BaseLayoutMapType = {
  title?: string | BaseComponent<BaseComponentProps>
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
    super(params.name, params.props, {
      ...params.options,
      onMount: (layout) => {
        this.eraseRoot()

        if (typeof params.options?.onMount === 'function') {
          params.options?.onMount(layout)
        }

        this.HTMLRootElement.appendChild(layout as Element)

        this.componentRender(layout)
      },
    })

    this.init()
  }

  protected abstract init(): void

  protected map: TLayoutMap = {} as TLayoutMap

  private convertLayoutMapToProps() {
    return Object.keys(this.map).reduce<TLayoutProps>((props, propKey) => {
      const propValue = this.map[propKey as keyof BaseLayoutMapType]

      return {
        ...props,
        [propKey]:
          propValue instanceof BaseComponent ? propValue.create() : propValue,
      }
    }, {} as TLayoutProps)
  }

  private eraseRoot() {
    this.HTMLRootElement.innerHTML = ''
  }

  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  public render() {
    document.title = this.props.documentTitle

    this.create(this.convertLayoutMapToProps())
  }
}

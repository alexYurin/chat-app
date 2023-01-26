import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index'
import { isFunction } from 'utils/index'

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
  props: BaseLayoutProps & TLayoutProps
  options?: BaseComponentOptions
}

export default abstract class BaseLayout<
  TLayoutProps extends BaseLayoutProps,
  TLayoutMap extends BaseLayoutMapType
> extends BaseComponent<TLayoutProps> {
  constructor(params: BaseLayoutParamsType<TLayoutProps>) {
    super(
      params.name,
      {
        ...params.props,
        rootElement: SELECTORS.root,
      },
      {
        ...params.options,
        onMount(this: BaseComponent<BaseComponentProps>, ...args) {
          const HTMLRootElement = this.getRootHTMLComponent()

          if (HTMLRootElement) {
            console.log('CREATE BASE COMPONENT')
            // HTMLRootElement.innerHTML = ''
          }

          if (isFunction(params.options?.onCreate)) {
            params.options?.onCreate(...args)
          }
        },
      }
    )

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

  public render() {
    const HTMLRootElement = this.getRootHTMLComponent()

    if (HTMLRootElement) {
      document.title = this.props.documentTitle
      HTMLRootElement.innerHTML = ''
      this.create(this.convertLayoutMapToProps())
    }
  }
}

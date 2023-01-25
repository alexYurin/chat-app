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

  private viewNodes(nodes: [BaseComponent<BaseComponentProps> | string]) {
    return nodes.map((node) => {
      if (node instanceof BaseComponent) {
        return node.create()
      }

      return node
    })
  }

  private createNodes() {
    return Object.keys(this.map).reduce((nodes, propKey) => {
      const node = this.map[propKey]

      if (Array.isArray(node)) {
        return {
          ...nodes,
          [propKey]: this.viewNodes(node),
        }
      }

      if (node instanceof BaseComponent) {
        return {
          ...nodes,
          [propKey]: node.create(),
        }
      }

      return {
        ...nodes,
        [propKey]: node,
      }
    }, {})
  }

  private HTMLRootElement = document.querySelector(
    SELECTORS.root
  ) as HTMLElement

  public render() {
    const props = this.createNodes()

    if (this.isMount) {
      this.componentUpdate(props)
    }

    document.title = this.props.documentTitle

    this.HTMLRootElement.innerHTML = this.create(props)

    this.componentRender()
  }
}

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
      params.options
    )

    this.init()
  }

  protected abstract init(): void

  protected map: TLayoutMap = {} as TLayoutMap

  private runHandleProps(handleName: 'create' | 'createTemplatePlacholder') {
    return Object.entries(this.map).reduce(
      (placeholderProps, [propKey, propValue]) => {
        if (propValue instanceof BaseComponent) {
          return {
            ...placeholderProps,
            [propKey]: propValue[handleName](),
          }
        }

        if (Array.isArray(propValue)) {
          return {
            ...placeholderProps,
            [propKey]: propValue.map((value) => {
              if (value instanceof BaseComponent) {
                return value[handleName]()
              }

              return value
            }),
          }
        }

        return {
          ...placeholderProps,
          [propKey]: propValue,
        }
      },
      {} as TLayoutProps
    )
  }

  public render() {
    const layoutPlaceholderProps = this.runHandleProps(
      'createTemplatePlacholder'
    )

    document.title = this.props.documentTitle

    this.create(layoutPlaceholderProps)
    this.runHandleProps('create')
  }
}

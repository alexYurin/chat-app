import BaseComponent, {
  BaseComponentProps,
  COMPONENT_LIFE_CYCLE_EVENT,
} from 'components/Base/index'

export interface BaseLayoutPropsType<
  TChildrenProps extends BaseComponentProps['children'],
  TData
> extends BaseComponentProps {
  pathname: string
  documentTitle: string
  data: TData
  children?: TChildrenProps
}

export interface BaseLayoutParamsType<
  TChildrenProps extends BaseComponentProps['children'],
  TData
> {
  name: string
  props: BaseLayoutPropsType<TChildrenProps, TData>
}

const SELECTORS = {
  root: '#root',
}

export default abstract class BaseLayout<
  TChildrenProps extends BaseComponentProps['children'],
  TData
> extends BaseComponent<BaseLayoutPropsType<TChildrenProps, TData>> {
  protected data: TData = {} as TData

  constructor(params: BaseLayoutParamsType<TChildrenProps, TData>) {
    super(params.name, {
      ...params.props,
      rootElement: SELECTORS.root,
    } as BaseLayoutPropsType<TChildrenProps, TData>)
    this.data = params.props.data

    this.init()
  }

  protected abstract init(): void

  public render() {
    document.title = this.props.documentTitle

    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.COMPILE)
  }
}

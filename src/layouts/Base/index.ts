import BaseComponent, { BaseComponentProps } from 'components/Base/index'

const SELECTORS = {
  root: '#root',
}

export default abstract class BaseLayout<
  TLayoutProps extends BaseComponentProps
> extends BaseComponent<TLayoutProps> {
  constructor(name: string, props: TLayoutProps) {
    super(name, {
      ...props,
      rootElement: SELECTORS.root,
    })

    this.init()
  }

  protected abstract init(): void

  public render() {
    const isUpdated = !this.isMount && !this.isInitRender

    if (isUpdated) {
      this.registerLifeCycleEvents()
    }

    this.dispatchCompile()
  }

  public getName() {
    return this.name
  }
}

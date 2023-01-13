import LayoutModel, { BaseModelType } from 'layouts/LayoutModel'

export interface BaseLayoutProps {
  pathname: string
  pageTitle: string
}

export default class BaseLayout<
  LayoutProps extends BaseLayoutProps,
  ModelData extends BaseModelType,
  LayoutModel extends BaseModelType
> {
  public layout = ''
  public modelConstructor: (model: ModelData) => LayoutModel = () =>
    ({} as LayoutModel)

  constructor(private props: LayoutProps) {
    return this
  }

  public createModel(modelData: ModelData) {
    return new LayoutModel(
      this.props.pathname,
      this.props.pageTitle,
      this.layout,
      this.modelConstructor(modelData)
    )
  }
}

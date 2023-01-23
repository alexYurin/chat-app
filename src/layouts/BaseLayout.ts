import LayoutModel from 'layouts/LayoutModel'

import BaseModel, { BaseModelType } from 'layouts/BaseModel'

export interface BaseLayoutProps {
  pathname: string
  pageTitle: string
}

export default class BaseLayout<
  LayoutProps extends BaseLayoutProps,
  ModelType extends BaseModelType
> {
  public layout = ''

  constructor(
    private props: LayoutProps,
    private model: BaseModel<LayoutProps, ModelType>
  ) {
    return this
  }

  public create() {
    return new LayoutModel(
      this.props.pathname,
      this.props.pageTitle,
      this.layout,
      this.model
    )
  }
}

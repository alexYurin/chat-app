import LayoutController from 'layouts/LayoutController'

import BaseModel, { BaseModelType } from 'layouts/BaseModel'

export interface BaseLayoutProps {
  pathname: string
  pageTitle: string
}

export default abstract class BaseLayout<
  LayoutProps extends BaseLayoutProps,
  ModelType extends BaseModelType
> {
  public layout = ''
  public pathname = ''
  public pageTitle = ''

  constructor(protected modelInstance: BaseModel<LayoutProps, ModelType>) {
    return this
  }

  public create() {
    return new LayoutController(
      this.pathname,
      this.pageTitle,
      this.layout,
      this.modelInstance
    )
  }
}

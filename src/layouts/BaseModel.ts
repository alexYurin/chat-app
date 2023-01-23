import BaseComponent, { BaseComponentProps } from 'components/Base/index.'

export type ViewPropsType = {
  [key: string]: string
}

export type BaseModelType = {
  title: string | BaseComponent<BaseComponentProps>
}
export default class BaseModel<ModelProps, ModelType extends BaseModelType> {
  protected model: ModelType = {} as ModelType

  constructor(protected props: ModelProps = {} as ModelProps) {
    this.props = props
  }

  protected configurate() {
    console.log('config step')
  }

  public mountComponents() {
    Object.values(this.model).forEach((element) => {
      if (element instanceof BaseComponent) {
        element.mountComponent()
      }
    })
  }

  public stringifyComponents(componentProps: BaseComponentProps = {}) {
    return Object.keys(this.model).reduce((viewProps, propKey: string) => {
      const element = this.model[propKey as keyof BaseModelType]

      if (element instanceof BaseComponent) {
        return {
          ...viewProps,
          [propKey]: element.create(componentProps),
        }
      }

      return {
        ...viewProps,
        [propKey]: element,
      }
    }, {} as ViewPropsType)
  }

  public getModel() {
    return this.model
  }

  public getProps() {
    return this.props
  }
}

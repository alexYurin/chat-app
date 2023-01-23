import BaseComponent, { BaseComponentProps } from 'components/Base/index.'
import { emitWarning } from 'process'

export type ViewPropsType = {
  [key: string]: string
}

export type BaseModelType = {
  title: string | BaseComponent<BaseComponentProps>
}
export default abstract class BaseModel<
  ModelProps,
  ModelType extends BaseModelType
> {
  protected model: ModelType = {} as ModelType

  constructor(protected props: ModelProps = {} as ModelProps) {
    this.props = props
  }

  protected abstract configurate(): void

  public mountComponents() {
    Object.values(this.model).forEach((element) => {
      if (element instanceof BaseComponent) {
        element.moduleMount()
      }
    })
  }

  public updateProps<ModelProps>(props: ModelProps) {
    this.props = { ...this.props, ...props }
    this.configurate()
  }

  private cc(
    component:
      | string
      | string[]
      | BaseComponent<BaseComponentProps>
      | BaseComponent<BaseComponentProps>[],
    props: BaseComponentProps
  ) {
    if (Array.isArray(component)) {
      component.map((element) => {
        if (element instanceof BaseComponent) {
          return element.create(props)
        } else if (Array.isArray(element)) {
          return this.cc(element, element.props)
        }
      })
    }

    return component
  }

  public createComponents(componentProps: BaseComponentProps = {}) {
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
}

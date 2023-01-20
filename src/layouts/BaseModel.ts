import { BaseComponent } from 'components'

export interface BaseModelType {
  components: []
}

export default class BaseModel<ModelType extends BaseModelType> {
  protected components: BaseComponent[] = []

  constructor(model: ModelType) {}

  getComponents() {
    return this.components
  }
}

import BaseComponent, { BaseComponentProps } from 'components/Base'

const createComponent = <T extends BaseComponentProps>(props: T) => {
  class TestComponent extends BaseComponent<T> {
    protected template = (locals: Record<string, unknown>) =>
      `.test-component(id="${locals.id}", class=${locals.className})`

    constructor(componentProps: T) {
      super('test-component', componentProps)
    }

    public compile() {
      this.compileComponent()
    }
  }

  return new TestComponent(props)
}

export default createComponent

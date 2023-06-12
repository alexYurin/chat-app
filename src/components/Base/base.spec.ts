import BaseComponent, { BaseComponentProps } from '.'
import { assert, expect } from 'chai'

describe('Компонент', () => {
  const createComponent = <T extends BaseComponentProps>(props: T) => {
    class TestComponent extends BaseComponent<T> {
      protected template = (locals: Record<string, any>) =>
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

  describe('Создание экземпляра', () => {
    it('Должен быть экземпляром базовового компонента', () => {
      const componentInstance = createComponent({})

      expect(componentInstance).to.be.an.instanceOf(BaseComponent)
    })
  })

  describe('Проверка пропсов', () => {
    it('Установка начальных пропсов', () => {
      const componentInstance = createComponent({
        id: 'test-component',
        className: 'test-component_extra-mode',
      })

      const componentProps = componentInstance.getProps()

      assert(componentProps.id, 'test-component')
      assert(componentProps.className, 'test-component_extra-mode')
    })

    it('Изменение пропсов', () => {
      const componentInstance = createComponent({
        id: 'test-component',
        className: 'test-component_extra-mode',
      })

      componentInstance.setProps({
        id: 'test-component2',
        className: 'test-component_extra-mode2',
      })

      const updatedComponentProps = componentInstance.getProps()

      assert(updatedComponentProps.id, 'test-component2')
      assert(updatedComponentProps.className, 'test-component_extra-mode2')
    })
  })
})

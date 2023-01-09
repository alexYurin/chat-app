import Renderer from 'renderer/Renderer'

export type ComponentListenerPropType = {
  eventType: Event['type']
  callback: (event: Event) => void
}

export interface BaseComponentOptions {
  listeners?: ComponentListenerPropType[]
}

export interface BaseComponentProps {
  slot?: string
}

const createRandomId = () => `_id_${(+new Date()).toString(36).slice(-5)}`

export default class BaseComponent<PropsType extends BaseComponentProps> {
  public id = ''
  public template = ''
  public HTMLRef: Element | null = null

  constructor(
    public name: string | null = null,
    private options: BaseComponentOptions = {}
  ) {
    if (typeof name === 'string') {
      this.addListeners()

      return this
    } else {
      throw new Error(`Invalid component name: ${this.name}`)
    }
  }

  private addListeners() {
    const { listeners } = this.options

    if (listeners?.length) {
      listeners.forEach((listener) => {
        window.addEventListener(listener.eventType, (event: Event) => {
          if (
            event.target === this.getElement() &&
            typeof listener.callback === 'function'
          ) {
            listener.callback(event)
          }
        })
      })
    }
  }

  public create(props: PropsType): string {
    if (Renderer) {
      this.id = createRandomId()

      const elementConatiner = document.createElement('div')
      elementConatiner.innerHTML = Renderer.toHTML(this.template, props)

      const element = elementConatiner.firstElementChild
      element?.setAttribute('data-component-id', this.id)

      return elementConatiner.innerHTML
    }

    return ''
  }

  public getElement() {
    if (this.id) {
      return document.querySelector(`[data-component-id=${this.id}]`)
    } else {
      throw new Error('Can`t get component before create')
    }
  }
}

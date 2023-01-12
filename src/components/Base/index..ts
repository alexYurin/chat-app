import Renderer from 'renderer/Renderer'

export type ComponentStatusType = 'primary' | 'success' | 'warning' | 'alert'

export type ComponentListenerPropType = {
  eventType: Event['type']
  callback: (event: Event) => void
}

export interface BaseComponentOptions {
  listeners?: ComponentListenerPropType[]
}

export interface BaseComponentProps {
  status?: ComponentStatusType
  id?: string
  className?: string
  slot?: string
}

export const generateRandomId = () =>
  `_id_${(+new Date()).toString(36).slice(-5)}`

export const componentAttributeNameId = 'data-component-id'

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
            event.target === this.getCurrentElement() &&
            typeof listener.callback === 'function'
          ) {
            listener.callback(event)
          }
        })
      })
    }
  }

  public prepareProps(props: PropsType): PropsType {
    return props
  }

  public create(props: PropsType): string {
    if (Renderer) {
      const preparedProps = this.prepareProps(props)

      this.id = generateRandomId()

      const elementTempContainer = document.createElement('div')
      elementTempContainer.innerHTML = Renderer.toHTML(
        this.template,
        preparedProps
      )

      const element = elementTempContainer.firstElementChild
      element?.setAttribute(componentAttributeNameId, this.id)

      return elementTempContainer.innerHTML
    }

    return ''
  }

  public getCurrentElement() {
    if (this.id) {
      return document.querySelector(`[${componentAttributeNameId}=${this.id}]`)
    } else {
      throw new Error('Can`t get component before create')
    }
  }
}

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

  constructor(
    public name: string | null = null,
    private props: PropsType = {} as PropsType,
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
            typeof listener.callback === 'function' &&
            this.isCurrentElement(event.target as HTMLElement)
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
    this.props = { ...this.props, ...props }

    if (Renderer) {
      const preparedProps = this.prepareProps(this.props)

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

  public isCurrentElement(element: HTMLElement) {
    return this.id === element.getAttribute(componentAttributeNameId)
  }

  public getProps() {
    return this.props
  }

  public getDOMRef() {
    if (this.id) {
      return document.querySelector(`[${componentAttributeNameId}=${this.id}]`)
    } else {
      throw new Error('Can`t get component before create and paste in DOM')
    }
  }
}

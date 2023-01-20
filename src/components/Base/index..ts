import Renderer from 'renderer/Renderer'
import { BaseModule } from 'core/index'
import { v4 as makeUUID } from 'uuid'

export type ComponentStatusType = 'primary' | 'success' | 'warning' | 'alert'

export type ComponentListenerPropType = {
  eventType: Event['type']
  callback: (event: Event) => void
}

export interface BaseComponentOptions {
  withId?: boolean
  listeners?: ComponentListenerPropType[]
}

export interface BaseComponentProps {
  status?: ComponentStatusType
  id?: string
  className?: string
  children?: string[]
}

export const componentAttributeNameId = 'data-component-id'

export default class BaseComponent<
  PropsType extends BaseComponentProps
> extends BaseModule {
  private id = ''
  protected template = ''

  constructor(
    protected name: string | null = null,
    private props: PropsType = {} as PropsType,
    private options: BaseComponentOptions = {}
  ) {
    super()
    this.options = { withId: true, ...options }

    if (typeof name === 'string') {
      this.addListeners()

      this.eventEmitter.on('@event:mount', () => {
        setTimeout(() => {
          console.log(this.name, this.getDOMRef())
        }, 1000)
      })

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

  public create(props: PropsType = {} as PropsType): string {
    this.props = { ...this.props, ...props }

    if (Renderer) {
      const preparedProps = this.prepareProps(this.props)

      if (this.options.withId) {
        this.id = `_id_${makeUUID()}`
      }

      const elementTempContainer = document.createElement('div')
      elementTempContainer.innerHTML = Renderer.toHTML(
        this.template,
        preparedProps
      )

      const element = elementTempContainer.firstElementChild
      element?.setAttribute(componentAttributeNameId, this.id)

      this.eventEmitter.emit('@event:mount')

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

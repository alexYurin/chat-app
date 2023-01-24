import Renderer from 'renderer/Renderer'
import { EventBus } from 'core/index'
import { identity } from 'utils/index'
import { v4 as makeUUID } from 'uuid'

export type ComponentStatusType = 'primary' | 'success' | 'warning' | 'alert'

export type ComponentListenerPropType = {
  eventType: Event['type']
  callback: (event: Event) => void
}

export interface BaseComponentOptions {
  withId?: boolean
  listeners?: ComponentListenerPropType[]
  onMount?: <T>(...args: T[]) => void
  onUpdate?: <T>(...args: T[]) => void
  onUnmount?: <T>(...args: T[]) => void
}

export interface BaseComponentProps {
  status?: ComponentStatusType
  id?: string
  className?: string
  children?: string[]
}

export const componentAttributeNameId = 'data-component-id'

export default abstract class BaseComponent<
  PropsType extends BaseComponentProps
> {
  private id = ''
  protected template = ''
  private eventEmitter = new EventBus()
  private unsubscribes: ComponentListenerPropType[] = []

  public isMount = false

  constructor(
    protected name: string | null = null,
    protected props: PropsType = {} as PropsType,
    protected options: BaseComponentOptions = {}
  ) {
    this.options = { withId: true, ...options }

    if (typeof name === 'string') {
      this.eventEmitter.on('@event:mount', this.options.onMount || identity)
      this.eventEmitter.on('@event:update', this.options.onUpdate || identity)
      this.eventEmitter.on('@event:unmount', this.options.onUnmount || identity)

      this.unsubscribes = this.addListeners()

      return this
    } else {
      throw new Error(`Invalid component name: ${this.name}`)
    }
  }

  protected componentMount<T>(...args: T[]) {
    this.isMount = true
    this.eventEmitter.emit('@event:mount', ...args)
  }

  protected componentUpdate<T>(...args: T[]) {
    this.eventEmitter.emit('@event:update', ...args)
  }

  protected componentUnmount<T>(...args: T[]) {
    this.eventEmitter.emit('@event:unmount', ...args)

    this.eventEmitter.off('@event:mount', this.options.onMount || identity)
    this.eventEmitter.off('@event:update', this.options.onUpdate || identity)
    this.eventEmitter.off('@event:unmount', this.options.onUnmount || identity)

    this.removeListeners()
  }

  private addListeners() {
    const { listeners } = this.options

    if (listeners?.length) {
      return listeners.map((listener) => {
        const subscribe = (event: Event) => {
          if (
            typeof listener.callback === 'function' &&
            this.isCurrentElement(event.target as HTMLElement)
          ) {
            listener.callback(event)
          }
        }

        window.addEventListener(listener.eventType, subscribe)

        return {
          eventType: listener.eventType,
          callback: subscribe,
        }
      }, [])
    }

    return []
  }

  private removeListeners() {
    this.unsubscribes.forEach((unsubscribe) => {
      window.removeEventListener(unsubscribe.eventType, unsubscribe.callback)
    })
  }

  public prepareProps(props: PropsType): PropsType {
    return props
  }

  public create(props: PropsType = {} as PropsType): string {
    this.props = { ...this.props, ...props }

    if (Renderer) {
      const preparedProps = this.prepareProps
        ? this.prepareProps(this.props)
        : this.props

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

  public updateProps(props: PropsType) {
    this.props = props
  }

  public getDOMRef() {
    if (this.id) {
      return document.querySelector(`[${componentAttributeNameId}=${this.id}]`)
    } else {
      throw new Error('Can`t get component before create and paste in DOM')
    }
  }
}

// const proxy = new Proxy(BaseComponent, {
//   set(target, prop, value) {
//     console.log('set new props!!!!!')

//     return true
//   },
// })

// console.log('BaseComponent', proxy)

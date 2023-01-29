import Templator from 'templators/index'
import EventBus, { EventCallback } from 'services/EventBus'
import { isFunction, identity } from 'utils/index'
import { v4 as makeUUID } from 'uuid'

export const COMPONENT_LIFE_CYCLE_EVENT = {
  CREATE: '@event-component:CREATE',
  MOUNT: '@event-component:MOUNT',
  UPDATE: '@event-component:UPDATE',
  UNMOUNT: '@event-component:UNMOUNT',
} as const

export type ComponentLifeCycleEventType =
  (typeof COMPONENT_LIFE_CYCLE_EVENT)[keyof typeof COMPONENT_LIFE_CYCLE_EVENT]

export type ComponentStatusType = 'primary' | 'success' | 'warning' | 'alert'

export type ComponentBrowserEventListenerPropType = {
  eventType: Event['type']
  callback: (event: Event) => void
}

export interface BaseComponentProps {
  id?: string
  status?: ComponentStatusType
  rootElement?: HTMLElement | string | null
  className?: string
  withInternalId?: boolean
  listeners?: ComponentBrowserEventListenerPropType[]
  children?: (BaseComponent<BaseComponentProps> | string)[]
}

export const componentAttributeNameId = 'data-component-id'
export const componentPlaceholderAttributeNameId = 'data-id'

export default abstract class BaseComponent<
  TPropsType extends BaseComponentProps
> {
  protected abstract template: string

  private internalId = ''
  private eventEmitter = new EventBus<ComponentLifeCycleEventType>()
  private browserEventUnsubscribers: ComponentBrowserEventListenerPropType[] =
    []
  private DOMElement: Element | null = null

  constructor(
    protected name: string | null = null,
    protected props: TPropsType = {
      children: [] as BaseComponentProps['children'],
    } as TPropsType
  ) {
    if (name && typeof name === 'string') {
      this.internalId = `_id_${makeUUID()}`

      this.subscribeToLifeCycleEvents()

      return this
    } else {
      throw new Error(
        `Invalid component name: ${this.name || 'empty string name'}`
      )
    }
  }

  private lifeCycleEventHandlers = {
    [COMPONENT_LIFE_CYCLE_EVENT.CREATE]: this.onCreateComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.MOUNT]: this.onMountComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.UPDATE]: this.onUpdateComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT]: this.onUnmountComponent.bind(this),
  }

  private subscribeToLifeCycleEvents(action: 'on' | 'off' = 'on') {
    Object.entries(this.lifeCycleEventHandlers).forEach(
      ([eventName, handler]) => {
        this.eventEmitter[action](
          eventName as ComponentLifeCycleEventType,
          handler as EventCallback
        )
      }
    )
  }

  private onCreateComponent(element: HTMLElement) {
    const HTMLRootElement = this.getHTMLRootElement()

    if (HTMLRootElement) {
      console.log('onCreate Root Layout', element)

      HTMLRootElement.innerHTML = ''

      HTMLRootElement.appendChild(element)
    } else {
      document
        .querySelector(
          `[${componentPlaceholderAttributeNameId}=${this.internalId}]`
        )
        ?.replaceWith(element)

      console.log('onCreate Child Element', element)
    }

    if (isFunction(this.onCreate)) {
      this.onCreate(element)
    }

    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.MOUNT, element)
  }

  private onMountComponent(element: HTMLElement) {
    this.browserEventUnsubscribers = this.addBrowserEventListeners()

    this.prepareChildren(this.props.children)

    if (isFunction(this.onMount)) {
      this.onMount(element)
    }

    console.log('onMount', element)
  }

  private onUpdateComponent(element: HTMLElement) {
    if (isFunction(this.onUpdate)) {
      this.onUpdate(element)
    }
  }

  private onUnmountComponent() {
    const HTMLRootElement = this.getHTMLRootElement()

    if (HTMLRootElement) {
      HTMLRootElement.innerHTML = ''
    }

    this.removeBrowserEventListeners()

    if (isFunction(this.onUnmount)) {
      this.onUnmount()
    }

    this.subscribeToLifeCycleEvents('off')

    this.DOMElement?.remove()
  }

  private addBrowserEventListeners() {
    const { listeners } = this.props

    if (listeners?.length) {
      return listeners.map((listener) => {
        this.DOMElement?.addEventListener(listener.eventType, listener.callback)

        return {
          eventType: listener.eventType,
          callback: listener.callback,
        }
      }, [])
    }

    return []
  }

  private removeBrowserEventListeners() {
    this.browserEventUnsubscribers.forEach((unsubscriber) => {
      this.DOMElement?.removeEventListener(
        unsubscriber.eventType,
        unsubscriber.callback
      )
    })
  }

  protected dispatch<T>(event: ComponentLifeCycleEventType, ...args: T[]) {
    this.eventEmitter.emit(event, ...args)
  }

  protected onCreate = identity
  protected onMount = identity
  protected onUpdate = identity
  protected onUnmount = identity

  protected createTemplatePlaceholder() {
    return `<div ${componentPlaceholderAttributeNameId}="${this.internalId}"></div>`
  }

  protected prepareChildren(children: BaseComponentProps['children']) {
    if (children?.length) {
      return children.map((child) => {
        if (child instanceof BaseComponent) {
          child.create({
            ...child.props,
            children: this.prepareChildren(child.props.children),
          })

          return child.createTemplatePlaceholder()
        }

        return child
      })
    }

    return []
  }

  public create(props: TPropsType = {} as TPropsType) {
    this.props = {
      ...this.props,
      ...props,
    }

    const elementTempContainer = document.createElement('div')

    elementTempContainer.innerHTML = Templator.compile(
      this.template,
      this.props
    )

    this.DOMElement = elementTempContainer.firstElementChild

    if (this.DOMElement instanceof HTMLElement) {
      if (this.props.withInternalId) {
        this.DOMElement.setAttribute(componentAttributeNameId, this.internalId)
      }

      this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.CREATE, this.DOMElement)

      return this.DOMElement
    }
  }

  public destroy() {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT)
  }

  public getInternalId() {
    return this.internalId
  }

  public getProps() {
    return this.props
  }

  public setProps(props: TPropsType) {
    this.props = props
  }

  public getHTMLElement() {
    return this.DOMElement
  }

  public getHTMLRootElement() {
    return this.props.rootElement instanceof HTMLElement
      ? this.props.rootElement
      : document.querySelector(this.props.rootElement as string)
  }
}

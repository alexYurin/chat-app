import Templator from 'templators/index'
import EventBus, { EventCallback } from 'services/EventBus'
import { isFunction, identity } from 'utils/index'
import { v4 as makeUUID } from 'uuid'

export const COMPONENT_LIFE_CYCLE_EVENT = {
  COMPILE: '@event-component:COMPILE',
  RENDER: '@event-component:RENDER',
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
    [COMPONENT_LIFE_CYCLE_EVENT.COMPILE]: this.compileComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.RENDER]: this.renderComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.MOUNT]: this.mountComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.UPDATE]: this.updateComponent.bind(this),
    [COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT]: this.unmountComponent.bind(this),
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

  private compileComponent() {
    const fragment = document.createElement('template')

    fragment.innerHTML = Templator.compile(this.template, {
      ...this.props,
      children: BaseComponent.handleChildren(
        'createTemplatePlaceholder',
        this.props.children
      ),
    })

    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.RENDER, fragment.content)

    return fragment.content
  }

  private renderComponent(fragment: DocumentFragment) {
    const HTMLRootElement = this.getRootElement()

    let DOMElement: Element | null = null

    if (HTMLRootElement) {
      HTMLRootElement.replaceChildren(fragment)

      DOMElement = HTMLRootElement.firstElementChild
    } else {
      const tempContainer = document.createElement('div')

      tempContainer.replaceChildren(fragment)

      DOMElement = tempContainer.firstElementChild as Element

      document
        .querySelector(
          `[${componentPlaceholderAttributeNameId}=${this.internalId}]`
        )
        ?.replaceWith(DOMElement)
    }

    if (isFunction(this.onRender)) {
      this.onRender(fragment)
    }

    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.MOUNT, DOMElement)
  }

  private mountComponent(element: Element) {
    this.DOMElement = element

    BaseComponent.handleChildren('compileComponent', this.props.children)

    this.browserEventUnsubscribers = this.addBrowserEventListeners()

    if (this.props.withInternalId) {
      this.DOMElement?.setAttribute(componentAttributeNameId, this.internalId)
    }

    if (isFunction(this.onMount)) {
      this.onMount(element)
    }
  }

  private updateComponent(element: HTMLElement) {
    if (isFunction(this.onUpdate)) {
      this.onUpdate(element)
    }
  }

  private unmountComponent() {
    const HTMLRootElement = this.getRootElement()

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

  private getRootElement() {
    return this.props.rootElement instanceof HTMLElement
      ? this.props.rootElement
      : document.querySelector(this.props.rootElement as string)
  }

  protected dispatch(event: ComponentLifeCycleEventType, ...args: unknown[]) {
    this.eventEmitter.emit(event, ...args)
  }

  protected onRender(...args: unknown[]) {
    identity(args)
  }

  protected onMount(...args: unknown[]) {
    identity(args)
  }

  protected onUpdate(...args: unknown[]) {
    identity(args)
  }

  protected onUnmount(...args: unknown[]) {
    identity(args)
  }

  protected createTemplatePlaceholder() {
    return `<div ${componentPlaceholderAttributeNameId}="${this.internalId}"></div>`
  }

  static handleChildren(
    handlerName: 'compileComponent' | 'createTemplatePlaceholder',
    children: BaseComponentProps['children']
  ) {
    return children?.map((child) => {
      if (child instanceof BaseComponent) {
        return child[handlerName]()
      }

      return child
    })
  }

  public destroy() {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT)
  }

  public getProps() {
    return this.props
  }

  public setProps(props: TPropsType) {
    this.props = props
  }

  public getDOMElement() {
    return this.DOMElement
  }
}

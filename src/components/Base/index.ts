import Templator from 'templators/index'
import EventBus, { EventCallback } from 'services/EventBus'
import { identity } from 'utils/index'
import { v4 as makeUUID } from 'uuid'

export const COMPONENT_LIFE_CYCLE_EVENT = {
  COMPILE: '@event-component:COMPILE',
  RENDER: '@event-component:RENDER',
  MOUNT: '@event-component:MOUNT',
  UPDATE_PROPS: '@event-component:UPDATE_PROPS',
  UNMOUNT: '@event-component:UNMOUNT',
} as const

export type ComponentLifeCycleEventType =
  (typeof COMPONENT_LIFE_CYCLE_EVENT)[keyof typeof COMPONENT_LIFE_CYCLE_EVENT]

export type ComponentStatusType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'alert'
  | 'default'

export type ComponentBrowserEventListenerPropType = {
  eventType: Event['type']
  callback: <TPropsType extends BaseComponentProps = BaseComponentProps>(
    this: BaseComponent<TPropsType>,
    event: Event
  ) => void
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
  protected isMount = false
  protected isFirstRender = true
  protected targetQueryForBrowserEvents: null | string = null

  private internalId = ''
  private eventEmitter = new EventBus<ComponentLifeCycleEventType>()
  private browserEventUnsubscribers: ComponentBrowserEventListenerPropType[] =
    []
  private DOMElement: Element | null = null

  constructor(
    protected name: string | null = null,
    protected props: TPropsType
  ) {
    if (name && typeof name === 'string') {
      this.internalId = `_id_${makeUUID()}`

      this.props.withInternalId = true
      this.props = this.makeProxyProps(props)

      this.registerLifeCycleEvents()

      return this
    } else {
      throw new Error(
        `Invalid component name: ${this.name || 'empty string name'}`
      )
    }
  }

  private makeProxyProps(props: TPropsType) {
    return new Proxy(props, {
      get: (props, propName) => {
        const newValue = props[propName as keyof TPropsType]

        return typeof newValue === 'function' ? newValue.bind(props) : newValue
      },
      set: (props, propName, newValue) => {
        const prevValue = props[propName as keyof TPropsType]

        props[propName as keyof TPropsType] = newValue

        this.dispatch(
          COMPONENT_LIFE_CYCLE_EVENT.UPDATE_PROPS,
          propName,
          prevValue,
          newValue
        )

        return true
      },
      deleteProperty() {
        throw new Error('Access denited')
      },
    })
  }

  private lifeCycleEventHandlers = {
    [COMPONENT_LIFE_CYCLE_EVENT.COMPILE]: this.compileComponent.bind(this),

    [COMPONENT_LIFE_CYCLE_EVENT.RENDER]: this.renderComponent.bind(this),

    [COMPONENT_LIFE_CYCLE_EVENT.MOUNT]: this.mountComponent.bind(this),

    [COMPONENT_LIFE_CYCLE_EVENT.UPDATE_PROPS]:
      this.updateComponentProps.bind(this),

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
      children: this.props.children?.map((child) => {
        if (child instanceof BaseComponent) {
          return child.createTemplatePlaceholder()
        }

        return child
      }),
    })

    this.isFirstRender = false
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

      const updatedElement = document.querySelector(
        `[${componentAttributeNameId}=${this.internalId}]`
      )

      if (updatedElement) {
        updatedElement.replaceWith(DOMElement)
      }

      document
        .querySelector(
          `[${componentPlaceholderAttributeNameId}=${this.internalId}]`
        )
        ?.replaceWith(DOMElement)
    }

    this.props.children?.forEach((child) => {
      if (child instanceof BaseComponent) {
        child.dispatch(COMPONENT_LIFE_CYCLE_EVENT.COMPILE)
      }
    })

    this.onRender(fragment)
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.MOUNT, DOMElement)
  }

  private mountComponent(element: Element) {
    this.DOMElement = element

    this.browserEventUnsubscribers = this.addBrowserEventListeners()

    if (this.props.withInternalId) {
      this.DOMElement?.setAttribute(componentAttributeNameId, this.internalId)
    }

    this.isMount = true

    this.onMount(element)
  }

  private updateComponentProps(
    propName: keyof TPropsType,
    prevValue: unknown,
    newValue: unknown
  ) {
    const isMustRender =
      this.onUpdateProps(propName, prevValue, newValue) && !this.isFirstRender

    if (isMustRender) {
      this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.COMPILE)
    }
  }

  private unmountComponent() {
    const HTMLRootElement = this.getRootElement()

    if (HTMLRootElement) {
      HTMLRootElement.innerHTML = ''
    }

    this.removeBrowserEventListeners()
    this.subscribeToLifeCycleEvents('off')
    this.DOMElement?.remove()

    this.isMount = false

    this.onUnmount()
  }

  private addBrowserEventListeners(): ComponentBrowserEventListenerPropType[] {
    const { listeners } = this.props

    if (listeners?.length) {
      const element = this.getEventTarget()

      return listeners.map((listener) => {
        const bindedCallback = listener.callback.bind(this)

        element?.addEventListener(listener.eventType, bindedCallback)

        return {
          eventType: listener.eventType,
          callback: bindedCallback,
        }
      }, [])
    }

    return []
  }

  private removeBrowserEventListeners() {
    const element = this.getEventTarget()

    this.browserEventUnsubscribers.forEach((unsubscriber) => {
      element?.removeEventListener(
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

  private createTemplatePlaceholder() {
    return `<div ${componentPlaceholderAttributeNameId}="${this.internalId}"></div>`
  }

  protected registerLifeCycleEvents() {
    this.subscribeToLifeCycleEvents('on')
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

  protected onUpdateProps(
    propKey: keyof TPropsType,
    prevProp: unknown,
    newProp: unknown
  ) {
    if (propKey) {
      return prevProp !== newProp
    }

    return false
  }

  protected onUnmount(...args: unknown[]) {
    identity(args)
  }

  public setProps(newProps: TPropsType) {
    Object.entries(newProps).forEach(([propKey, newValue]) => {
      this.props[propKey as keyof TPropsType] = newValue
    })
  }

  public getProps() {
    return this.props
  }

  public destroy() {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT)
  }

  public getChildren() {
    return this.props.children
  }

  public getDOMElement<T extends Element>() {
    return this.DOMElement as T
  }

  public getEventTarget<T extends Element>() {
    return (
      this.targetQueryForBrowserEvents
        ? this.DOMElement?.querySelector(this.targetQueryForBrowserEvents)
        : this.DOMElement
    ) as T
  }
}

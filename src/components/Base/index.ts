import Templator from 'templators/index'
import EventBus, { EventCallback } from 'services/EventBus'
import { StateType } from 'services/Store'
import { identity } from 'utils/index'
import { v4 as makeUUID } from 'uuid'
import { isEquals } from 'utils/index'

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

export interface BaseComponentProps extends StateType {
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
  private internalId = ''
  private eventEmitter = new EventBus<ComponentLifeCycleEventType>()
  private browserEventUnsubscribers: ComponentBrowserEventListenerPropType[] =
    []
  private DOMElement: Element | null = null

  protected template: (locals: Record<string, unknown>) => string = () => ''
  protected isMount = false
  protected isInitRender = true
  protected targetQueryForBrowserEvents: null | string = null
  protected disableRenderPropsList: string[] = []

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

  private makeProxyProps(proxyProps: TPropsType) {
    return new Proxy(proxyProps, {
      get: (props, propName) => {
        const newValue = props[propName as keyof TPropsType]

        return typeof newValue === 'function' ? newValue.bind(props) : newValue
      },
      set: (props, propName, newValue) => {
        const prevValue = props[propName as keyof TPropsType]

        props[propName as keyof TPropsType] = newValue

        this.dispatchUpdateProps(
          propName as keyof TPropsType,
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

  protected compileComponent() {
    const fragment = document.createElement('template')

    const props = this.props as BaseComponentProps

    fragment.innerHTML = Templator.compile(this.template, {
      ...props,
      children: props.children?.map((child) => {
        if (child instanceof BaseComponent) {
          return child.createTemplatePlaceholder()
        }

        return child
      }),
    })

    this.isInitRender = false
    this.dispatchRender(fragment.content)

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
        child.dispatchCompile()
      }
    })

    this.onRender(fragment)
    this.dispatchMount(DOMElement)
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
    const isUpdated =
      this.onUpdateProps(propName, prevValue, newValue) && !this.isInitRender

    if (isUpdated) {
      this.dispatchCompile()
    }
  }

  private unmountComponent() {
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

  protected dispatch(event: ComponentLifeCycleEventType, ...args: unknown[]) {
    this.eventEmitter.emit(event, ...args)
  }

  protected dispatchCompile(...args: unknown[]) {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.COMPILE, ...args)
  }

  protected dispatchRender(...args: unknown[]) {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.RENDER, ...args)
  }

  protected dispatchMount(...args: unknown[]) {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.MOUNT, ...args)
  }

  protected dispatchUpdateProps(
    propName: keyof TPropsType,
    prevValue: unknown,
    newValue: unknown
  ) {
    this.dispatch(
      COMPONENT_LIFE_CYCLE_EVENT.UPDATE_PROPS,
      propName,
      prevValue,
      newValue
    )
  }

  protected dispatchUnmount(...args: unknown[]) {
    this.dispatch(COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT, ...args)
  }

  protected registerLifeCycleEvents() {
    this.subscribeToLifeCycleEvents('on')
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
      return !isEquals(prevProp, newProp)
    }

    return false
  }

  protected onUnmount(...args: unknown[]) {
    identity(args)
  }

  static findParentComponent(
    target: EventTarget | HTMLElement,
    children: BaseComponentProps['children']
  ) {
    if (target instanceof HTMLElement) {
      const internalId = target
        ?.closest(`[${componentAttributeNameId}]`)
        ?.getAttribute(componentAttributeNameId)

      if (internalId) {
        return BaseComponent.findChild(internalId as string, children)
      }
    }

    return undefined
  }

  static findChild<TComponentType extends BaseComponent<BaseComponentProps>>(
    targetOrInternalId: HTMLElement | string,
    children: BaseComponentProps['children']
  ): TComponentType | undefined {
    return children?.reduce((findedChild, child) => {
      if (child instanceof BaseComponent) {
        const internalId = (
          targetOrInternalId instanceof HTMLElement
            ? targetOrInternalId.getAttribute(componentAttributeNameId)
            : targetOrInternalId
        ) as string

        if (child.internalId === internalId) {
          findedChild = child as TComponentType
        } else if (!findedChild) {
          findedChild = BaseComponent.findChild(
            internalId,
            child.getChildren()
          ) as TComponentType
        }
      }

      return findedChild
    }, undefined as undefined | TComponentType)
  }

  public setProps<TComponentPropsType extends TPropsType>(
    newProps: Partial<TComponentPropsType>
  ) {
    Object.entries(newProps).forEach(([propKey, newValue]) => {
      this.props[propKey as keyof TPropsType] = newValue
    })
  }

  public getProps() {
    return this.props
  }

  public destroy() {
    this.dispatchUnmount()
  }

  public getInternalId() {
    return this.internalId
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
        ? this.DOMElement?.querySelector(this.targetQueryForBrowserEvents) ||
          this.DOMElement
        : this.DOMElement
    ) as T
  }
}

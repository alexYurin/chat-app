import Templator from 'templators/index'
import { EventBus } from 'services/index'
import { isFunction } from 'utils/index'
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

export type ComponentListenerPropType = {
  eventType: Event['type']
  callback: (event: Event) => void
}

export interface BaseComponentOptions {
  withId?: boolean
  listeners?: ComponentListenerPropType[]
  onCreate?: <T>(...args: T[]) => void
  onMount?: <T>(...args: T[]) => void
  onUpdate?: <T>(...args: T[]) => void
  onUnmount?: <T>(...args: T[]) => void
}

export interface BaseComponentProps {
  rootElement?: HTMLElement | string | null
  status?: ComponentStatusType
  id?: string
  className?: string
  children?: BaseComponent<BaseComponentProps>[] | string[]
}

export const componentAttributeNameId = 'data-component-id'
export const componentPlaceholderAttributeNameId = 'data-id'

export default abstract class BaseComponent<
  TPropsType extends BaseComponentProps
> {
  protected abstract template: string

  private id = ''
  private eventEmitter = new EventBus<ComponentLifeCycleEventType>()
  private unsubscribes: ComponentListenerPropType[] = []
  private DOMElement: Element | null = null

  constructor(
    protected name: string | null = null,
    protected props: TPropsType = {} as TPropsType,
    protected options: BaseComponentOptions = {}
  ) {
    this.options = { withId: true, ...options }

    if (this.options.withId) {
      this.id = `_id_${makeUUID()}`
    }

    if (typeof name === 'string') {
      this.eventEmitter.on(
        COMPONENT_LIFE_CYCLE_EVENT.CREATE,
        this.onCreateComponent.bind(this)
      )
      this.eventEmitter.on(
        COMPONENT_LIFE_CYCLE_EVENT.MOUNT,
        this.onMountComponent.bind(this)
      )
      this.eventEmitter.on(
        COMPONENT_LIFE_CYCLE_EVENT.UPDATE,
        this.onUpdateComponent.bind(this)
      )
      this.eventEmitter.on(
        COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT,
        this.onUnmountComponent.bind(this)
      )

      return this
    } else {
      throw new Error(`Invalid component name: ${this.name}`)
    }
  }

  protected dispatchComponentCreate<T>(...args: T[]) {
    this.eventEmitter.emit(COMPONENT_LIFE_CYCLE_EVENT.CREATE, ...args)
  }

  protected dispatchComponentMount<T>(...args: T[]) {
    this.eventEmitter.emit(COMPONENT_LIFE_CYCLE_EVENT.MOUNT, ...args)
  }

  protected dispatchComponentUpdate<T>(...args: T[]) {
    this.eventEmitter.emit(COMPONENT_LIFE_CYCLE_EVENT.UPDATE, ...args)
  }

  protected dispatchComponentUnmount<T>(...args: T[]) {
    this.eventEmitter.emit(COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT, ...args)

    this.eventEmitter.off(
      COMPONENT_LIFE_CYCLE_EVENT.CREATE,
      this.onCreateComponent
    )
    this.eventEmitter.off(
      COMPONENT_LIFE_CYCLE_EVENT.MOUNT,
      this.onMountComponent
    )
    this.eventEmitter.off(
      COMPONENT_LIFE_CYCLE_EVENT.UPDATE,
      this.onUpdateComponent
    )
    this.eventEmitter.off(
      COMPONENT_LIFE_CYCLE_EVENT.UNMOUNT,
      this.onUnmountComponent
    )
  }

  private onCreateComponent(element: HTMLElement) {
    const HTMLRootElement = this.getHTMLRootElement()

    if (HTMLRootElement) {
      HTMLRootElement.innerHTML = ''

      HTMLRootElement.appendChild(element)
    } else {
      document
        .querySelector(`[${componentPlaceholderAttributeNameId}=${this.id}]`)
        ?.replaceWith(element)
    }

    if (isFunction(this.options.onCreate)) {
      this.options.onCreate.call(this, element)
    }

    this.dispatchComponentMount(element)
  }

  private onMountComponent(element: HTMLElement) {
    this.unsubscribes = this.addEventListeners()

    if (isFunction(this.options.onMount)) {
      this.options.onMount.call(this, element)
    }
  }

  private onUpdateComponent<T>(...args: T[]) {
    if (isFunction(this.options.onUpdate)) {
      this.options.onUpdate.call(this, ...args)
    }
  }

  private onUnmountComponent<T>(...args: T[]) {
    const HTMLRootElement = this.getHTMLRootElement()

    if (HTMLRootElement) {
      HTMLRootElement.innerHTML = ''
    }

    this.removeEventListeners()

    if (isFunction(this.options.onUnmount)) {
      this.options.onUnmount.call(this, ...args)
    }
  }

  private addEventListeners() {
    const { listeners } = this.options

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

  private removeEventListeners() {
    this.unsubscribes.forEach((unsubscribe) => {
      window.removeEventListener(unsubscribe.eventType, unsubscribe.callback)
    })
  }

  public prepareProps(props: TPropsType): TPropsType {
    return props
  }

  public create(props: TPropsType = {} as TPropsType) {
    this.props = { ...this.props, ...props }

    const elementTempContainer = document.createElement('div')

    const preparedProps = this.prepareProps
      ? this.prepareProps(this.props)
      : this.props

    elementTempContainer.innerHTML = Templator.compile(
      this.template,
      preparedProps
    )

    this.DOMElement = elementTempContainer.firstElementChild

    if (this.DOMElement instanceof HTMLElement) {
      this.DOMElement.setAttribute(componentAttributeNameId, this.id)

      this.dispatchComponentCreate(this.DOMElement)

      return this.DOMElement
    }
  }

  public createTemplatePlacholder() {
    return `<div data-id="${this.id}"></div>`
  }

  public getComponentId() {
    return this.id
  }

  public getProps() {
    return this.props
  }

  public updateProps(props: TPropsType) {
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

  public getComponentDomQuery() {
    return `[${componentAttributeNameId}=${this.id}]`
  }
}

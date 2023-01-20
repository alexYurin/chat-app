import { EventBus } from 'core/index'

export default class BaseModule {
  protected eventEmitter: EventBus

  constructor() {
    this.eventEmitter = new EventBus()
  }

  moduleMount<T>(...args: T[]) {
    this.eventEmitter.emit('@event:mount', ...args)
  }

  moduleUpdate<T>(...args: T[]) {
    this.eventEmitter.emit('@event:update', ...args)
  }
}

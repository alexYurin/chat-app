export type EventCallback = (...args: unknown[]) => void

export type Listener<TEventType extends string> = {
  [key in TEventType]?: EventCallback[]
}

export default class EventBus<TEvent extends string> {
  private listeners: Listener<TEvent> = {}

  static isFoundEvent<TCurrentEvent>(event: TCurrentEvent) {
    return Array.isArray(this.prototype.listeners[event])
  }

  on(event: TEvent, callback: EventCallback) {
    this.listeners[event] = [...(this.listeners[event] || []), callback]
  }

  off(event: TEvent, callback: EventCallback) {
    if (EventBus.isFoundEvent(event)) {
      this.listeners[event] = this.listeners[event]?.filter(
        (listener) => listener !== callback
      )
    } else {
      throw new Event(`Not found event: ${event}`)
    }
  }

  emit<T>(event: TEvent, ...args: T[]) {
    if (EventBus.isFoundEvent(event)) {
      this.listeners[event]?.forEach((listener) => listener(...args))
    } else {
      throw new Event(`Not found event: ${event}`)
    }
  }
}

export type EventType = '@event:mount' | '@event:update'

export type EventCallback = (...args: unknown[]) => void

export type Listener = {
  [key in EventType]?: EventCallback[]
}

export default class EventBus {
  private listeners: Listener = {} as Listener

  on(event: EventType, callback: EventCallback) {
    this.listeners[event] = [...(this.listeners[event] || []), callback]
  }

  off(event: EventType, callback: EventCallback) {
    if (Array.isArray(this.listeners[event])) {
      this.listeners[event] = this.listeners[event]?.filter(
        (listener) => listener !== callback
      )
    } else {
      throw new Event(`Not found event: ${event}`)
    }
  }

  emit<T>(event: EventType, ...args: T[]) {
    if (Array.isArray(this.listeners[event])) {
      this.listeners[event]?.forEach((listener) => listener(...args))
    } else {
      throw new Event(`Not found event: ${event}`)
    }
  }
}

export type HistoryListenerType = (event: Event) => void

export default class AppHistory {
  private appHistory = window.history

  public getBrowserHistory() {
    return this.appHistory
  }

  public addListeners(listeners: HistoryListenerType[] = []) {
    listeners.forEach((listener) => {
      window.addEventListener('popstate', listener.bind(this))
    })
  }

  public pushTo(url: string, title = '', state: unknown = {}) {
    if (window.location.href === url) {
      return
    }

    this.appHistory.pushState(state, title, url)

    window.dispatchEvent(new Event('popstate'))
  }

  public getState<TState extends Record<string, unknown>>() {
    return this.appHistory.state as TState
  }

  public forward() {
    this.appHistory.forward()
  }

  public back() {
    this.appHistory.back()
  }

  public getLength() {
    return this.appHistory.length
  }
}

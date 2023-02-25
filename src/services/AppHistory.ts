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

    this.appHistory.replaceState(state, title, url)

    window.dispatchEvent(new Event('popstate'))
  }

  public forward() {
    this.appHistory.forward()
  }

  public back() {
    this.appHistory.back()
  }
}

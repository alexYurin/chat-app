export type AppHistoryOptionsType = {
  onChangeURL?: (event: Event) => void
}

export default class AppHistory {
  private appHistory = window.history

  constructor(private options: AppHistoryOptionsType = {}) {
    this.addListeners()

    return this
  }

  private onChange(event: Event) {
    if (typeof this.options.onChangeURL === 'function') {
      this.options.onChangeURL(event)
    }
  }

  private addListeners() {
    window.addEventListener('popstate', this.onChange.bind(this))
  }

  public pushTo(url: string) {
    if (window.location.href === url) {
      return
    }

    this.appHistory.pushState({}, '', url)

    window.dispatchEvent(new Event('popstate'))
  }
}

export type HistoryPusherOptionsType = {
  onChangeURL?: (event: Event) => void
}

export default class HistoryPusher {
  constructor(private options: HistoryPusherOptionsType = {}) {
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

  static pushTo(url: string, state = {}, title = '') {
    window.history.pushState(state, title, url)

    window.dispatchEvent(new Event('popstate'))
  }
}

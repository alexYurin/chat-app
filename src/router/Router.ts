export type RouterOptionsType = {
  onChangeURL?: (event: Event) => void
}

export default class Router {
  constructor(private options: RouterOptionsType = {}) {
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

  static redirectTo(url: string) {
    window.history.pushState({}, '', url)

    window.dispatchEvent(new Event('popstate'))
  }
}

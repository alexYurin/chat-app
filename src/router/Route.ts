import * as views from 'views/index'

export type ViewType = (typeof views)[keyof typeof views]

export default class Route {
  private viewInstance: ReturnType<ViewType['createView']> | null = null

  constructor(
    private title: string,
    private pathname: string,
    private view: ViewType
  ) {
    return this
  }

  public navigate(pathname: string) {
    if (this.isMatch(pathname)) {
      this.render()
    }
  }

  public render() {
    this.viewInstance = this.view?.createView()

    if (this.viewInstance) {
      document.title = this.title

      this.viewInstance.render()
    }
  }

  public leave() {
    this.viewInstance?.destroy()
  }

  public isMatch(pathname: string) {
    return this.pathname === pathname
  }
}

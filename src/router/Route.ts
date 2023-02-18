import * as views from 'views/index'
import BaseLayout from 'layouts/Base'
import { BaseComponentProps } from 'components/Base'

export type ViewType = (typeof views)[keyof typeof views]

export default class Route {
  private layout: BaseLayout<BaseComponentProps> | null = null

  constructor(
    private title: string,
    private pathname: string,
    private View: ViewType
  ) {
    return this
  }

  public navigate(pathname: string) {
    if (this.isMatch(pathname)) {
      this.render()
    }
  }

  public render() {
    this.layout = new this.View()

    if (this.layout) {
      document.title = this.title

      this.layout.render()
    }
  }

  public leave() {
    this.layout?.destroy()
  }

  public isMatch(pathname: string) {
    return this.pathname === pathname
  }
}

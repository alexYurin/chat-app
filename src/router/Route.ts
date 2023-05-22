import * as views from 'views/index'
import BaseLayout from 'layouts/Base'
import { BaseComponentProps } from 'components/Base'

export type ViewType = (typeof views)[keyof typeof views]

export default class Route {
  private layout: BaseLayout<BaseComponentProps> | null = null

  constructor(private View: ViewType) {
    return this
  }

  public runRender(pathname: string) {
    if (this.isMatch(pathname)) {
      this.render()
    }
  }

  public render() {
    this.layout = new this.View() as BaseLayout<BaseComponentProps>

    if (this.layout) {
      document.title = this.View.title

      this.layout.render()
    }
  }

  public leave() {
    this.layout?.destroy()
  }

  public isMatch(pathname: string) {
    if (this.View.allowedPaths.length > 0) {
      return (
        this.View.allowedPaths.includes(pathname as never) ||
        this.View.pathname === pathname
      )
    }

    return this.View.pathname === pathname
  }

  public getName() {
    return this.View.id
  }

  public getLayout() {
    return this.layout
  }
}

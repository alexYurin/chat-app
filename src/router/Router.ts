import { HistoryPusher } from 'services/index'
import { BaseComponentProps } from 'components/Base'
import BaseLayout from 'layouts/Base'
import routes from 'router/routes'
import * as views from 'views/index'

type ViewType = BaseLayout<BaseComponentProps['children'], any>

const routesCollection = Object.values(routes).map((route) => route.pathname)

const isDefinedPath = (pathname: string) => routesCollection.includes(pathname)

const isMatchedPaths = (currentPathname: string, pathname: string) =>
  currentPathname === pathname

export default class Router {
  private currentPathname = window.location.pathname
  private currentView: ViewType | null = null

  constructor() {
    this.addListeners()
    this.init()

    return this
  }

  private init() {
    const isUnknownRoute = !isDefinedPath(this.currentPathname)

    if (isUnknownRoute) {
      return HistoryPusher.pushTo(routes.notFound.pathname)
    }

    this.renderCurrentView()
  }

  private onChangeUrl() {
    this.currentPathname = window.location.pathname

    this.renderCurrentView()
  }

  private renderCurrentView() {
    Object.values(views).forEach((view) => {
      const { Layout, props } = view

      if (this.isCurrentRoute(props.pathname)) {
        if (this.currentView) {
          this.currentView.destroy()
        }

        const { name, pathname, documentTitle, data } = props

        this.currentView = new Layout({
          name,
          props: {
            pathname,
            documentTitle,
            data: data as any,
          },
        })

        this.currentView.render()
      }
    })
  }

  private addListeners() {
    new HistoryPusher({
      onChangeURL: this.onChangeUrl.bind(this),
    })
  }

  public isCurrentRoute(pathname: string) {
    return isMatchedPaths(this.currentPathname, pathname)
  }
}

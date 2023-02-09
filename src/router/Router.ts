import { AppHistory } from 'services/index'
import { BaseComponentProps } from 'components/Base'
import BaseLayout from 'layouts/Base'
import routes from 'router/routes'
import Route, { ViewType } from './Route'
import * as views from 'views/index'

const routesCollection = Object.values(routes).map((route) => route.pathname)

const isDefinedPath = (pathname: string) => routesCollection.includes(pathname)

const isMatchedPaths = (currentPathname: string, pathname: string) =>
  currentPathname === pathname

export default class Router {
  private currentPathname = window.location.pathname
  private currentView: ViewType | null = null
  private routes: Route[] = []
  private history = History

  constructor() {
    this.init()

    return this
  }

  private init() {
    const isUnknownRoute = !isDefinedPath(this.currentPathname)

    if (isUnknownRoute) {
      return AppHistory.pushTo(routes.notFound.pathname)
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

  private getRoute(pathname: string) {
    return this.routes.find((route) => route.isMatch(pathname))
  }

  public run() {
    new AppHistory({
      onChangeURL: this.onChangeUrl.bind(this),
    })
  }

  public use(name: string, pathname: string, view: ViewType) {
    const route = new Route(name, pathname, view)

    this.routes = [...this.routes, route]

    return this
  }

  public isCurrentRoute(pathname: string) {
    return isMatchedPaths(this.currentPathname, pathname)
  }
}

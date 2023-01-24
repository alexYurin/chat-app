import { HistoryPusher } from 'services/index'
import routes from 'router/routes'
import * as views from 'views/index'

const routesCollection = Object.values(routes).map((route) => route.pathname)

const isDefinedPath = (pathname: string) => routesCollection.includes(pathname)

const isMatchedPaths = (currentPathname: string, pathname: string) =>
  currentPathname === pathname

export default class Router {
  private currentPathname = window.location.pathname

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
    Object.values(views).forEach((View) => {
      if (this.isCurrentRoute(View.props?.pathname)) {
        View.render()
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

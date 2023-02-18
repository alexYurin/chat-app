import { AppHistory } from 'services/index'
import routes, { RoutesTypes } from 'router/routes'
import Route, { ViewType } from './Route'

type RoutePathType = RoutesTypes[keyof RoutesTypes]['pathname']

const routesCollection = Object.values(routes).map((route) => route.pathname)
const isDefinedPath = (pathname: string) =>
  routesCollection.includes(pathname as RoutePathType)

class Router {
  private currentPathname = window.location.pathname
  private currentRoute: Route | null = null
  private routes: Route[] = []
  private history = new AppHistory()

  private onRoute() {
    this.currentPathname = window.location.pathname

    this.dispatchRoute()
  }

  private dispatchRoute() {
    const route = this.getRoute(this.currentPathname)

    if (!route) {
      return this.navigate(routes.notFound.pathname)
    }

    if (this.currentRoute) {
      this.currentRoute.leave()
    }

    this.currentRoute = route
    this.currentRoute.navigate(this.currentPathname)
  }

  private getRoute(pathname: string) {
    return this.routes.find((route) => route.isMatch(pathname))
  }

  public navigate(pathname: string) {
    this.history.pushTo(pathname)
  }

  public run() {
    this.history.addListeners([this.onRoute.bind(this)])

    if (!isDefinedPath(this.currentPathname)) {
      return this.history.pushTo(routes.notFound.pathname)
    }

    this.dispatchRoute()
  }

  public use(name: string, pathname: string, View: ViewType) {
    const route = new Route(name, pathname, View)

    this.routes = [...this.routes, route]

    return this
  }
}

export default new Router()

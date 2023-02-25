import { AppHistory } from 'services/index'
import routes from 'router/routes'
import Route, { ViewType } from './Route'
import RouterController from './controller'

const INIT_APP_DELAY = 400

class Router {
  private currentPathname = window.location.pathname
  private currentRoute: Route | null = null
  private routes: Route[] = []
  private history = new AppHistory()
  private controller = new RouterController(routes)

  private onRoute() {
    this.currentPathname = this.controller.navigator(window.location.pathname)

    this.setRoute()
  }

  private setRoute() {
    const route = this.getRoute(this.currentPathname)

    if (!route) {
      return this.navigate(routes.notFound.pathname)
    }

    if (this.currentRoute) {
      this.currentRoute.leave()
    }

    this.currentRoute = route
    this.currentRoute.runRender(this.currentPathname)
  }

  public getRoute(pathname: string) {
    return this.routes.find((route) => route.isMatch(pathname))
  }

  public navigate(pathname: string) {
    this.history.pushTo(pathname)
  }

  public async run() {
    await this.controller.checkUser()

    this.history.addListeners([this.onRoute.bind(this)])

    setTimeout(() => {
      this.onRoute()
      this.navigate(this.currentPathname)
    }, INIT_APP_DELAY)
  }

  public use(View: ViewType) {
    const route = new Route(View)

    this.routes = [...this.routes, route]

    return this
  }

  public forward() {
    this.history.forward()
  }

  public back() {
    this.history.back()
  }
}

export default new Router()

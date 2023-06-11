import { AppHistory } from 'services/index'
import routes from 'router/routes'
import Route, { ViewType } from './Route'
import RouterController from './controller'

const INIT_APP_DELAY = 400

export type AppHistoryStateType = {
  isWithoutRender?: boolean
}

export class Router {
  private currentPathname = window.location.pathname
  private currentRoute: Route | null = null
  private routes: Route[] = []
  private history = new AppHistory()
  private controller = new RouterController(routes)
  private searchParams = window.location.search

  private onRoute() {
    if (this.currentRoute?.getPathname() === window.location.pathname) {
      return
    }

    const urlParams = this.searchParams || ''

    this.currentPathname = this.controller.getCurrentPathname(
      window.location.pathname + urlParams
    )

    this.setRoute()
  }

  private setRoute() {
    const route = this.getRoute(this.currentPathname)
    const historyState = this.history.getState<AppHistoryStateType>()
    const isAllowedPath = historyState?.isWithoutRender && route

    if (isAllowedPath) {
      return route.getLayout()
        ? this.navigate(this.currentPathname)
        : route.runRender(this.currentPathname)
    }

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

  public navigate(pathname: string, state: AppHistoryStateType = {}) {
    const currentPathname = this.controller.getCurrentPathname(pathname)

    if (this.currentPathname === currentPathname && !state.isWithoutRender) {
      this.history.pushTo(currentPathname)

      return
    }

    const nextRoute = this.getRoute(currentPathname)
    const routeName = nextRoute?.getName()

    this.history.pushTo(currentPathname, routeName, {
      ...state,
      page: routeName,
    })

    this.searchParams = ''
  }

  public async run() {
    await this.checkUser().catch((error) => error)

    this.history.addListeners([this.onRoute.bind(this)])

    setTimeout(() => {
      this.onRoute()
      this.navigate(this.currentPathname)
    }, INIT_APP_DELAY)
  }

  public async checkUser() {
    return await this.controller.checkUser()
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

  public setURLParams(params: Record<string, string>, pathname?: string) {
    const urlParams = new URLSearchParams(window.location.search)
    const historyState = this.history.getState<AppHistoryStateType>()
    const routeName = this.currentRoute?.getName()
    const oath = pathname
      ? this.controller.getCurrentPathname(pathname)
      : this.currentPathname

    Object.entries(params).forEach(([key, value]) => {
      urlParams.set(key, value)
    })

    this.history.pushTo(`${oath}?${urlParams.toString()}`, routeName, {
      ...historyState,
      page: routeName,
    })
  }
}

export default new Router()

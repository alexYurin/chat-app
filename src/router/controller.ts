import AuthController from 'layouts/Auth/controller'
import { RoutesTypes } from 'router/routes'
import { store } from 'services/index'

type RoutePathType = RoutesTypes[keyof RoutesTypes]['pathname']

export default class RouterController {
  private routesCollection: string[] = []

  constructor(private routes: RoutesTypes) {
    this.routesCollection = Object.values(routes).map((route) => route.pathname)

    return this
  }

  private isDefinedPath(pathname: string) {
    return this.routesCollection.includes(pathname as RoutePathType)
  }

  public async checkUser() {
    return await new AuthController().checkUser()
  }

  public getCurrentPathname(pathname: string) {
    const { user, error } = store.getState()
    const isDefinedPath = this.isDefinedPath(pathname)
    const isFakeErrorParh = pathname === this.routes.error.pathname && !error
    const isMessengerPath = pathname === this.routes.chat.pathname
    const isAuthPath =
      pathname === this.routes.signIn.pathname ||
      pathname === this.routes.signUp.pathname

    if (!isDefinedPath || isFakeErrorParh) {
      return this.routes.notFound.pathname
    }

    if (user && (isAuthPath || isMessengerPath)) {
      return this.routes.chat.pathname
    }

    if (!user && isMessengerPath) {
      return this.routes.signIn.pathname
    }

    return pathname
  }
}

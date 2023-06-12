import AuthApi from 'api/Auth'
import { RoutesTypes } from 'router/routes'
import { store } from 'services/index'

type RoutePathType = RoutesTypes[keyof RoutesTypes]['pathname']

const authApi = new AuthApi()

export default class RouterController {
  private routesCollection: string[] = []

  constructor(private routes: RoutesTypes) {
    this.routesCollection = Object.values(routes).reduce(
      (allowedRoutes, route) => {
        if (route.View.allowedPaths.length > 0) {
          return [
            ...allowedRoutes,
            ...route.View.allowedPaths,
            route.pathname,
          ] as RoutePathType[]
        }

        return [...allowedRoutes, route.pathname]
      },
      [] as RoutePathType[]
    )

    return this
  }

  private isDefinedPath(pathname: string) {
    return this.routesCollection.includes(pathname as RoutePathType)
  }

  public async checkUser() {
    const updatedUser = await authApi.fetchUser()

    if (updatedUser) {
      store.set('user', updatedUser)

      return updatedUser
    }

    return 'Пользователь не найден'
  }

  public getCurrentPathname(pathname: string) {
    const { user, error } = store.getState()

    const [path, urlParams] = pathname.split('?')

    const isDefinedPath = this.isDefinedPath(path)

    const isFakeErrorPath = path === this.routes.error.pathname && !error

    const isMessengerPath =
      path === this.routes.chat.pathname ||
      this.routes.chat.View.allowedPaths.includes(path)

    const isAuthPath =
      path === this.routes.signIn.pathname ||
      path === this.routes.signUp.pathname

    if (!isDefinedPath || isFakeErrorPath) {
      return this.routes.notFound.pathname
    }

    if (user && isMessengerPath) {
      return path
    }

    if (user && isAuthPath) {
      return this.routes.chat.pathname
    }

    if (!user && isMessengerPath) {
      return this.routes.signIn.pathname
    }

    return path
  }
}

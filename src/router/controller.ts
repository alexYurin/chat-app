import AuthApi from 'api/Auth'
import routes, { RoutesTypes } from 'router/routes'
import { store } from 'services/index'

type RoutePathType = RoutesTypes[keyof RoutesTypes]['pathname']

const authApi = new AuthApi()

export default class RouterController {
  private routesCollection: string[] = []

  constructor() {
    this.routesCollection = Object.values(routes).reduce(
      (allowedRoutes, route) => {
        if (route.allowedPaths.length > 0) {
          return [
            ...allowedRoutes,
            ...route.allowedPaths,
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

    const [path] = pathname.split('?')

    const isDefinedPath = this.isDefinedPath(path)

    const isFakeErrorPath = path === routes.error.pathname && !error

    const isMessengerPath =
      path === routes.chat.pathname || routes.chat.allowedPaths.includes(path)

    const isAuthPath =
      path === routes.signIn.pathname || path === routes.signUp.pathname

    if (!isDefinedPath || isFakeErrorPath) {
      return routes.notFound.pathname
    }

    if (user && isMessengerPath) {
      return path
    }

    if (user && isAuthPath) {
      return routes.chat.pathname
    }

    if (!user && isMessengerPath) {
      return routes.signIn.pathname
    }

    return path
  }
}

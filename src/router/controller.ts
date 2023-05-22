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
    try {
      const updatedUser = await authApi.fetchUser()

      store.set('user', updatedUser)

      return updatedUser
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        console.warn(response.reason)

        throw new Error('Пользователь не найден')
      }
    }
  }

  public getCurrentPathname(pathname: string) {
    const { user, error } = store.getState()

    const isDefinedPath = this.isDefinedPath(pathname)

    const isFakeErrorPath = pathname === this.routes.error.pathname && !error

    const isMessengerPath =
      pathname === this.routes.chat.pathname ||
      this.routes.chat.View.allowedPaths.includes(pathname)

    const isAuthPath =
      pathname === this.routes.signIn.pathname ||
      pathname === this.routes.signUp.pathname

    if (!isDefinedPath || isFakeErrorPath) {
      return this.routes.notFound.pathname
    }

    if (user && isMessengerPath) {
      return pathname
    }

    if (user && isAuthPath) {
      return this.routes.chat.pathname
    }

    if (!user && isMessengerPath) {
      return this.routes.signIn.pathname
    }

    return pathname
  }
}

import { AuthSignInApi, AuthSignUpApi, AuthUserApi, AuthLogoutApi } from './api'
import { AuthSignInRequestParamsType } from './api/SignIn'
import { FormValuesType } from './index'
import { Router, routes } from 'router/index'
import { store } from 'services/index'

const authSignInApi = new AuthSignInApi()
const authSignUpApi = new AuthSignUpApi()
const authUserApi = new AuthUserApi()
const authLogoutApi = new AuthLogoutApi()

const isSignInValues = (
  values: FormValuesType
): values is AuthSignInRequestParamsType => {
  return (values as AuthSignInRequestParamsType).login !== undefined
}

class AuthController {
  public async setAuth(values: FormValuesType) {
    store.set('isLoading', true)

    try {
      const response = await (isSignInValues(values)
        ? authSignInApi.mutate(values)
        : authSignUpApi.mutate(values))

      await this.checkUser()

      Router.navigate(routes.chat.pathname)

      return response
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        store.set('error', {
          status: error.status,
          message: response.reason || response.message,
        })
      }

      Router.navigate(routes.error.pathname)

      return error
    } finally {
      store.set('isLoading', false)
    }
  }

  public async checkUser() {
    try {
      const response = await authUserApi.fetch()

      store.set('user', response)

      return response
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        return response
      }
    }
  }

  public async logout() {
    store.set('isLoading', true)

    try {
      const response = await authLogoutApi.mutate()

      store.set('user', null)

      Router.navigate(routes.signIn.pathname)
      return response
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        return response
      }
    } finally {
      store.set('isLoading', false)
    }
  }
}

export default AuthController

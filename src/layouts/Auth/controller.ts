import AuthApi, { AuthSignUpRequestParamsType } from 'api/Auth'
import { FormValuesType } from './index'
import { Router, routes } from 'router/index'
import { store } from 'services/index'

const authApi = new AuthApi()

const isSignUpValues = (
  values: FormValuesType
): values is AuthSignUpRequestParamsType => {
  return (values as AuthSignUpRequestParamsType).email !== undefined
}

class AuthController {
  public async setAuth(values: FormValuesType) {
    store.set('isLoading', true)

    try {
      const response = await (isSignUpValues(values)
        ? authApi.signUp(values)
        : authApi.signIn(values))

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
      const response = await authApi.fetchUser()

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
      const response = await authApi.logout()

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

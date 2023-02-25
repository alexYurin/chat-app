import { AuthSignInApi, AuthSignUpApi } from './api'
import { AuthSignInRequestParamsType } from './api/SignIn'
import { FormValuesType } from './index'
import { Router, routes } from 'router/index'
import { store } from 'services/index'

const signInApi = new AuthSignInApi()
const signUpApi = new AuthSignUpApi()

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
        ? signInApi.mutate(values)
        : signUpApi.mutate(values))

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
}

export default AuthController

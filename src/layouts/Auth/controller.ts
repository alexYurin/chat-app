import fetchDecorator from 'api/fetchDecorator'
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
  @fetchDecorator({ withAppLoading: true })
  public async setAuth(values: FormValuesType) {
    const response = await (isSignUpValues(values)
      ? authApi.signUp(values)
      : authApi.signIn(values))

    await this.checkUser()

    Router.navigate(routes.chat.pathname)

    return response
  }

  @fetchDecorator()
  public async checkUser() {
    const response = await authApi.fetchUser()

    store.set('user', response)

    return response
  }

  @fetchDecorator({ withAppLoading: true })
  public async logout() {
    const response = await authApi.logout()

    store.set('user', null)

    Router.navigate(routes.signIn.pathname)

    return response
  }
}

export default AuthController

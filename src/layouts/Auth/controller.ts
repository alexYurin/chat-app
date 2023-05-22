import withHandleErrors from 'api/withHandleErrors'
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
  @withHandleErrors({ withAppLoading: true, withRouteOnErrorPage: true })
  public async setAuth(values: FormValuesType) {
    const response = await (isSignUpValues(values)
      ? authApi.signUp(values)
      : authApi.signIn(values))

    const id = (response as Record<string, number>)?.id

    if (response === 'OK' || id >= 0) {
      await this.checkUser()

      Router.navigate(routes.chat.pathname)

      return response
    }

    throw new Error('Ошибка авторизации')
  }

  @withHandleErrors({ withRouteOnErrorPage: false })
  public async checkUser() {
    const updatedUser = await authApi.fetchUser()

    if (updatedUser) {
      store.set('user', updatedUser)

      return updatedUser
    }

    throw new Error('Ошибка проверки пользователя')
  }

  @withHandleErrors({ withAppLoading: true })
  public async logout() {
    const response = await authApi.logout()

    if (response === 'OK') {
      store.set('user', null)

      Router.navigate(routes.signIn.pathname)

      return response
    }

    throw new Error('Ошибка при выходе их аккаунта')
  }
}

export default AuthController

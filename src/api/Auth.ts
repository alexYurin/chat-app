import { BaseApi } from 'api/index'
import { UserType } from 'types/user'

export type AuthUserResponseType = UserType

export type AuthSignInRequestParamsType = {
  login: string
  password: string
}

export type AuthSignUpRequestParamsType = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export type AuthSignUpResponseType = {
  id: number
}

export default class AuthApi extends BaseApi {
  public fetchUser() {
    return this.get<AuthUserResponseType>('auth/user', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public signIn(payload: AuthSignInRequestParamsType) {
    return this.post('auth/signin', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public signUp(payload: AuthSignUpRequestParamsType) {
    return this.post<AuthSignUpResponseType>('auth/signup', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public logout() {
    return this.post('auth/logout')
  }
}

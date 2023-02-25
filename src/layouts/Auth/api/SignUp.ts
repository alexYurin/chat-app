import { BaseApi } from 'api/index'

export type AuthSignUpRequestParamsType = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export type AuthSignUpReponseType = {
  id: number
}

export default class AuthSignUpApi extends BaseApi {
  mutate(payload: AuthSignUpRequestParamsType) {
    return this.post<AuthSignUpReponseType>('auth/signup', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

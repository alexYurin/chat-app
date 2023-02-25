import { BaseApi } from 'api/index'

export type AuthSignInRequestParamsType = {
  login: string
  password: string
}

export default class AuthSignInApi extends BaseApi {
  mutate(payload: AuthSignInRequestParamsType) {
    return this.post('auth/signin', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

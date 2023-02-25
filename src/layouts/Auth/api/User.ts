import { BaseApi } from 'api/index'
import { UserType } from 'types/user'

export default class AuthUserApi extends BaseApi {
  fetch() {
    return this.get<UserType>('auth/user', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

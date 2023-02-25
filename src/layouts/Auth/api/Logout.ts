import { BaseApi } from 'api/index'

export default class LogoutApi extends BaseApi {
  mutate() {
    return this.post('auth/logout')
  }
}

import { BaseApi } from 'api/index'

export type ProfileChangePasswordRequestParamsType = {
  oldPassword: string
  newPassword: string
}

export default class ProfileChangeApi extends BaseApi {
  mutate(payload: ProfileChangePasswordRequestParamsType) {
    return this.put('user/password', {
      data: payload,
    })
  }
}

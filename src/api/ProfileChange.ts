import { BaseApi } from 'api/index'
import { UserType } from 'types/user'

export type ProfileChangeRequestParamsType = UserType

export type ProfileChangeResponseType = UserType

export default class ProfileChangeApi extends BaseApi {
  mutate(payload: ProfileChangeRequestParamsType) {
    return this.put<ProfileChangeResponseType>('user/provile', {
      data: payload,
    })
  }
}

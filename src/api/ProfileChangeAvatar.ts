import { BaseApi } from 'api/index'
import { UserType } from 'types/user'

export type ProfileChangeAvatarRequestParamsType = FormData

export type ProfileChangeAvatarResponseType = UserType

export default class ProfileChangeAvatarApi extends BaseApi {
  mutate(payload: ProfileChangeAvatarRequestParamsType) {
    return this.put<ProfileChangeAvatarResponseType>('user/profile/avatar', {
      data: payload,
    })
  }
}

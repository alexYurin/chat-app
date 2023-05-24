import { BaseApi } from 'api/index'
import { UserType } from 'types/user'

export type ProfileChangeRequestParamsType = UserType

export type ProfileChangeResponseType = UserType

export type ProfileChangeAvatarRequestParamsType = FormData

export type ProfileChangeAvatarResponseType = UserType

export type ProfileChangePasswordRequestParamsType = {
  oldPassword: string
  newPassword: string
}

export default class ProfileApi extends BaseApi {
  public change(payload: ProfileChangeRequestParamsType) {
    return this.put<ProfileChangeResponseType>('user/profile', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public changeAvatar(payload: ProfileChangeAvatarRequestParamsType) {
    return this.put<ProfileChangeAvatarResponseType>('user/profile/avatar', {
      data: payload,
    })
  }

  public changePassword(payload: ProfileChangePasswordRequestParamsType) {
    return this.put('user/password', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

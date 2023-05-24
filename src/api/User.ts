import { BaseApi } from 'api/index'
import { UserType } from 'types/user'

export type UserDetailRequestParamsType = {
  userId: string
}

export type UserDetailResponseType = UserType

export type UserFindRequestParamsType = {
  login: string
}

export type UserFindResponseType = UserType[]

export default class UserApi extends BaseApi {
  public detail(payload: UserDetailRequestParamsType) {
    return this.get<UserDetailResponseType>(`user/${payload.userId}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public find(payload: UserFindRequestParamsType) {
    return this.post<UserFindResponseType>('user/search', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

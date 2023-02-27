import AuthController from 'layouts/Auth/controller'
import {
  ProfileChangeApi,
  ProfileChangeAvatarApi,
  ProfileChangePasswordApi,
} from 'api/index'
import { ProfileChangePasswordRequestParamsType } from 'api/ProfileChangePassword'
import { Router, routes } from 'router/index'
import { store } from 'services/index'
import { UserType } from 'types/user'

const profileChangeAvatarApi = new ProfileChangeAvatarApi()
const profileChangeApi = new ProfileChangeApi()
const profileChangePasswordApi = new ProfileChangePasswordApi()

export default class ChatController {
  public async changeAvatar(avatar: File) {
    try {
      const formData = new FormData()

      formData.append('avatar', avatar)

      const response = await profileChangeAvatarApi.mutate(formData)

      store.set('user', response)

      return response
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        store.set('error', {
          status: error.status,
          message: response.reason || response.message,
        })
      }

      Router.navigate(routes.error.pathname)

      return error
    }
  }

  public async changeProfile(user: UserType) {
    try {
      const response = await profileChangeApi.mutate(user)

      store.set('user', response)

      return response
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        store.set('error', {
          status: error.status,
          message: response.reason || response.message,
        })
      }

      Router.navigate(routes.error.pathname)

      return error
    }
  }

  public async changePassword(form: ProfileChangePasswordRequestParamsType) {
    try {
      const response = await profileChangePasswordApi.mutate(form)

      return response
    } catch (error) {
      if (error instanceof XMLHttpRequest) {
        const response = JSON.parse(error.response)

        store.set('error', {
          status: error.status,
          message: response.reason || response.message,
        })
      }

      Router.navigate(routes.error.pathname)

      return error
    }
  }

  public async logout() {
    return await new AuthController().logout()
  }
}

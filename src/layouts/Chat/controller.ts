import AuthController from 'layouts/Auth/controller'
import { ProfileChangeAvatarApi } from 'api/index'
import { Router, routes } from 'router/index'
import { store } from 'services/index'

const profileChangeAvatarApi = new ProfileChangeAvatarApi()

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

  public async logout() {
    return await new AuthController().logout()
  }
}

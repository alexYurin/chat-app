import { AuthApi } from 'api/index'
import ChatApi, { ChatCreateRequestParamsType } from 'api/Chat'
import ProfileApi, { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { Router, routes } from 'router/index'
import { store } from 'services/index'
import { UserType } from 'types/user'

const profileApi = new ProfileApi()
const authApi = new AuthApi()
const chatApi = new ChatApi()

function decorate<T extends ChatController, K extends keyof T>(
  target: T,
  key: K,
  descriptor: T[K] extends (n: number) => number
    ? TypedPropertyDescriptor<(n: number) => number>
    : never
) {
  const f = descriptor.value

  // if (f) {
  //   descriptor.value = function (this: T, x: number) {
  //     return f(this.mySecretNumber * x)
  //   }
  // }

  // return descriptor
}

export default class ChatController {
  public async fetchChatUsers(chatId: number) {
    try {
      const users = await chatApi.fetchUsers({
        chatId,
        offset: 0,
        limit: 100,
      })

      const { contacts } = store.getState()

      store.set(
        'contacts',
        contacts?.map((contact) => {
          if (contact.detail.id === chatId) {
            return {
              ...contact,
              users,
            }
          }

          return contact
        })
      )

      return users
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

  public async fetchChats(activeChatId?: number) {
    try {
      const chats = await chatApi.fetchChats({
        offset: 0,
        limit: 20,
      })

      const contacts = chats.map((contact) => {
        return {
          isActive: contact.id === activeChatId,
          detail: contact,
        }
      })

      store.set('contacts', contacts)

      return chats
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

  @decorate
  public async createChat(form: ChatCreateRequestParamsType) {
    try {
      const response = await chatApi.createChat(form)

      if (response?.id) {
        return 'OK'
      }

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

  public async changeAvatar(avatar: File) {
    try {
      const formData = new FormData()

      formData.append('avatar', avatar)

      const response = await profileApi.changeAvatar(formData)

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
      const response = await profileApi.change(user)

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
      const response = await profileApi.changePassword(form)

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
    return await authApi.logout()
  }
}

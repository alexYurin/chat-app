import fetchDecorator from 'api/fetchDecorator'
import { AuthApi, UserApi } from 'api/index'
import ChatApi, {
  ChatCreateRequestParamsType,
  ChatRemoveRequestParamsType,
} from 'api/Chat'
import ProfileApi, { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { Router, routes } from 'router/index'
import { store } from 'services/index'
import { UserType } from 'types/user'

const profileApi = new ProfileApi()
const authApi = new AuthApi()
const chatApi = new ChatApi()
const userApi = new UserApi()

export default class ChatController {
  @fetchDecorator({ withRouteOnErrorPage: true })
  public async fetchChatUsers(chatId: number) {
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
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async findUser(login: string) {
    const [user] = await userApi.find({ login })

    if (user) {
      const chatId = await this.createChat({
        title: user.display_name || user.login,
      })

      if (typeof chatId === 'number') {
        const response = await this.addUsersToChat(chatId, [user.id as number])

        console.log('RESP addUsersToChat', response)

        return response
      }
    }

    return Promise.resolve('Пользователь не найден')
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async fetchChats(activeChatId?: number) {
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
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async addUsersToChat(chatId: number, users: number[]) {
    const response = await chatApi.addUsersToChat({
      chatId,
      users,
    })

    // if (response?.id) {
    //   return response?.id
    // }

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async createChat(form: ChatCreateRequestParamsType) {
    const response = await chatApi.createChat(form)

    if (response?.id) {
      return response?.id
    }

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async removeChat(form: ChatRemoveRequestParamsType) {
    const response = await chatApi.removeChat(form)

    if (response?.userId) {
      return 'OK'
    }

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async changeAvatar(avatar: File) {
    const formData = new FormData()

    formData.append('avatar', avatar)

    const response = await profileApi.changeAvatar(formData)

    store.set('user', response)

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async changeProfile(user: UserType) {
    const response = await profileApi.change(user)

    store.set('user', response)

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async changePassword(form: ProfileChangePasswordRequestParamsType) {
    const response = await profileApi.changePassword(form)

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async logout() {
    await authApi.logout()

    store.set('user', null)

    Router.navigate(routes.signIn.pathname)
  }
}

import fetchDecorator from 'api/fetchDecorator'
import { AuthApi, UserApi } from 'api/index'
import ChatApi, {
  ChatCreateRequestParamsType,
  ChatRemoveRequestParamsType,
} from 'api/Chat'
import ProfileApi, { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { Router, routes } from 'router/index'
import { store, SocketClient } from 'services/index'
import { UserType } from 'types/user'
import { ChatMessageType } from 'types/chat'

const profileApi = new ProfileApi()
const authApi = new AuthApi()
const chatApi = new ChatApi()
const userApi = new UserApi()

export default class ChatController {
  private handleSocketMessage(event: MessageEvent) {
    const payload = JSON.parse(event.data)

    if (event.type === 'message' && Array.isArray(payload)) {
      store.set('messages', payload)

      return
    }

    if (event.type === 'message' && typeof payload === 'string') {
      console.log('new message', payload)

      return
    }
  }

  private addSocketListeners(chatId: number, client: SocketClient) {
    client.on('open', () => {
      console.log(`Установлено соединение: Чат ${chatId}`)
    })

    client.on('close', (event) => {
      if (event.wasClean) {
        console.log(`Соединение закрыто чисто: Чат ${chatId}`)
      } else {
        console.log(
          `Обрыв соединения: Чат ${chatId} - Код: ${event.code} | Причина: "${event.reason}"`
        )
      }
    })

    client.on('error', (event) => {
      console.error(`Ошибка соединения: Чат ${chatId}, ${event.message}`)
    })

    client.on('message', (event) => {
      this.handleSocketMessage(event as MessageEvent)
    })

    setInterval(() => {
      client.ping()
    }, 3000)
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async fetchChatUsers(chatId: number) {
    const users = await chatApi.fetchUsers({
      chatId,
      offset: 0,
      limit: 20,
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
  public async createChatWithAddUser(title: string, login: string) {
    const [user] = await userApi.find({ login })

    if (user) {
      const chatId = await this.createChat({
        title,
      })

      if (typeof chatId === 'number') {
        const response = await this.addUsersToChat(chatId, [user.id as number])

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

    const oldContacts = store.getState().contacts

    const contacts = chats.map((contact) => {
      const oldContact = oldContacts?.find(
        (currentContact) => currentContact.detail.id === contact.id
      )

      const contactDescription = {
        isActive: contact.id === activeChatId,
        detail: contact,
      }

      if (oldContact) {
        return {
          ...contactDescription,
          client: oldContact?.client,
        }
      } else {
        return this.connectToChat(contact.id).then((client) => {
          return {
            ...contactDescription,
            client,
          }
        })
      }
    })

    const connectedContacts = await Promise.all(contacts)

    const withUsers = connectedContacts.map((connectedContact) => {
      return this.getChatUsers(connectedContact.detail.id).then((response) => {
        return {
          ...connectedContact,
          users: response,
        }
      })
    })

    const connectedContactsWithUsers = await Promise.all(withUsers)

    store.set('contacts', connectedContactsWithUsers)

    return chats
  }

  public async connectToChat(chatId: number) {
    const { user } = store.getState()
    const { token } = await chatApi.fetchChatToken({ chatId })

    const client = new SocketClient({
      chatId,
      token,
      userId: user?.id as number,
    })

    this.addSocketListeners(chatId, client)

    return client
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async getChatUsers(chatId: number) {
    const response = await chatApi.fetchUsers({ chatId })

    return response
  }

  @fetchDecorator({ withRouteOnErrorPage: true })
  public async addUsersToChat(chatId: number, users: number[]) {
    const response = await chatApi.addUsersToChat({
      chatId,
      users,
    })

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

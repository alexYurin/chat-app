import withHandleErrors from 'api/withHandleErrors'
import { AuthApi, UserApi } from 'api/index'
import ChatApi, {
  ChatCreateRequestParamsType,
  ChatRemoveRequestParamsType,
} from 'api/Chat'
import ProfileApi, { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { Router, routes } from 'router/index'
import { store, SocketClient } from 'services/index'
import { UserType } from 'types/user'
import { ChatContactRoomType, ChatMessageType } from 'types/chat'
import { isFunction, first, isArray } from 'utils/index'

export type ControllerOptionsType = {
  onOpenSocket?: (chatId: number, client: SocketClient) => void
  onGetMessage?: (chatId: number, message: ChatMessageType) => void
  onGetMessages?: (chatId: number, messages: ChatMessageType[]) => void
}

const profileApi = new ProfileApi()
const authApi = new AuthApi()
const chatApi = new ChatApi()
const userApi = new UserApi()

const MESSAGES_COUNT = 20
const RECONNECT_SOCKET_DELAY = 500

export default class ChatController {
  constructor(private options: ControllerOptionsType) {
    return this
  }

  private onGetMessage(chatId: number, event: MessageEvent) {
    const { currentContact, messages } = store.getState()

    const payload = JSON.parse(event.data)

    if (event.type === 'message' && isArray(payload)) {
      const messageOnce = first(messages as ChatMessageType[])

      const isCurrent = currentContact?.detail.id === messageOnce?.chat_id

      if (isFunction(this.options.onGetMessages)) {
        this.options.onGetMessages(chatId, payload)
      }

      if (payload.length === 0) {
        if (!isCurrent) {
          store.set('messages', payload)
        }

        return
      }

      if (messages && messages?.length > 0) {
        const payloadReversed = payload.reverse()

        const updatedMessages = isCurrent
          ? [...payloadReversed, ...messages]
          : payloadReversed

        store.set('messages', updatedMessages)
      } else {
        const reversed = payload.reverse()

        store.set('messages', reversed)
      }

      return
    }

    if (payload.type === 'message') {
      this.fetchNewCountMessages(chatId)

      if (currentContact?.detail.id === chatId) {
        store.set('messages', [
          ...(messages as ChatMessageType[]),
          { ...payload, chat_id: chatId },
        ])
      }

      if (isFunction(this.options.onGetMessage)) {
        this.options.onGetMessage(chatId, payload)
      }
    }
  }

  private addSocketListeners(chatId: number, client: SocketClient) {
    client.on('open', () => {
      console.log(`Установлено соединение: Чат ${chatId}`)

      client.getHistory(0)

      if (isFunction(this.options.onOpenSocket)) {
        this.options.onOpenSocket(chatId, client)
      }
    })

    client.on('close', (event) => {
      if (event.wasClean) {
        console.log(`Соединение закрыто чисто: Чат ${chatId}`)
      } else {
        console.log(
          `Обрыв соединения: Чат ${chatId} - Код: ${event.code} | Причина: "${event.reason}"`
        )

        setTimeout(() => {
          this.connectToChat(chatId)
        }, RECONNECT_SOCKET_DELAY)
      }
    })

    client.on('error', (event) => {
      console.error(`Ошибка соединения: Чат ${chatId}, ${event.message}`)
    })

    client.on('message', (event) => {
      this.onGetMessage(chatId, event as MessageEvent)
    })
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async fetchNewCountMessages(chatId: number) {
    const response = await chatApi.fetchNewCountMessages({ chatId })

    if (response?.unread_count >= 0) {
      return response
    }

    return { unread_count: 0 }
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async fetchChatUsers(chatId: number) {
    const users = await chatApi.fetchUsers({
      chatId,
      offset: 0,
      limit: MESSAGES_COUNT,
    })

    if (isArray(users)) {
      const { contacts } = store.getState()

      store.set(
        'contacts',
        contacts?.map((contact) =>
          contact.detail.id === chatId ? { ...contact, users } : contact
        )
      )

      return users
    }

    return []
  }

  @withHandleErrors({ withRouteOnErrorPage: false })
  public async AddUserByLoginToChat(login: string, chatId: number) {
    const [user] = await userApi.find({ login })

    if (user) {
      const response = await this.addUsersToChat(chatId, [user.id as number])

      return response
    }

    return 'Пользователь не найден'
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async removeUserFromChat(userId: number, chatId: number) {
    const response = await chatApi.removeUsersFromChat({
      users: [userId],
      chatId,
    })

    if (response === 'OK') {
      return response
    }

    return 'Ошибка при удалении пользователя из чата'
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async fetchChats() {
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
        isActive: false,
        isConnected: false,
        detail: contact,
      }

      if (oldContact?.client) {
        oldContact.client.close()
      }

      return {
        ...contactDescription,
        client: oldContact?.client,
      }
    }) as ChatContactRoomType[]

    store.set('currentContact', null)
    store.set('messages', [])

    const contactsWithUsers = contacts.map((connectedContact) => {
      return this.getChatUsers(connectedContact.detail.id).then((response) => ({
        ...connectedContact,
        users: response,
      }))
    })

    const storedContactsWithUsers = await Promise.all(contactsWithUsers)

    if (isArray(storedContactsWithUsers)) {
      store.set('contacts', storedContactsWithUsers)

      return storedContactsWithUsers
    }

    return []
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
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

  public disconnectChat(contact: ChatContactRoomType) {
    const reasonMessage = `Чат №${contact.detail.id} закрыт`

    contact.client.close(reasonMessage)
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async getChatUsers(chatId: number) {
    return await chatApi.fetchUsers({ chatId })
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async addUsersToChat(chatId: number, users: number[]) {
    return await chatApi.addUsersToChat({
      chatId,
      users,
    })
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async createChat(form: ChatCreateRequestParamsType) {
    const response = await chatApi.createChat(form)

    const chatId = response?.id

    if (typeof chatId === 'number') {
      return 'OK'
    }

    return `Ошибка при создании чата: ${response}`
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async removeChat(form: ChatRemoveRequestParamsType) {
    const response = await chatApi.removeChat(form)

    if (response?.userId) {
      return 'OK'
    }

    return `Ошибка при удалении чата: ${response}`
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async changeAvatar(avatar: File) {
    const formData = new FormData()

    formData.append('avatar', avatar)

    const updatedUser = await profileApi.changeAvatar(formData)

    if (updatedUser) {
      store.set('user', updatedUser)
    }
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async changeProfile(user: UserType) {
    const updatedUser = await profileApi.change(user)

    if (updatedUser) {
      store.set('user', updatedUser)
    }
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async changePassword(form: ProfileChangePasswordRequestParamsType) {
    const response = await profileApi.changePassword(form)

    if (response === 'OK') {
      return response
    }

    return 'Ошибка при смене пароля пользователя'
  }

  @withHandleErrors({ withRouteOnErrorPage: true })
  public async logout() {
    const response = await authApi.logout()

    if (response === 'OK') {
      store.set('user', null)
      store.set('currentContact', null)
      store.set('contacts', [])

      store.set('messages', [])

      Router.navigate(routes.signIn.pathname)

      return response
    }

    return 'Ошибка при выходе из аккаунта'
  }
}

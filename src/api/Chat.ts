import { BaseApi } from 'api/index'
import { ChatContactType } from 'types/chat'
import { UserType } from 'types/user'

export type ChatsRequestParamsType =
  | {
      title?: string
      offset?: number
      limit?: number
    }
  | undefined

export type ChatCreateRequestParamsType = {
  title: string
}

export type ChatCreateResponseType = {
  id: number
}

export type ChatRemoveRequestParamsType = {
  chatId: number
}

export type ChatRemoveResponseType = {
  userId: number
  result: {
    id: number
    title: string
    avatar: string
  }
}

export type ChatUsersRequestParamsType = {
  chatId: number
  offset?: number
  limit?: number
  name?: string
  email?: string
}

export type ChatUsersResponseType = UserType[]

export type ChatNewMessagesCountRequestParamsType = {
  chatId: number
}

export type ChatNewMessagesCountResponseType = {
  unread_count: number
}

export default class ChatApi extends BaseApi {
  public fetchChats(payload: ChatsRequestParamsType) {
    return this.get<ChatContactType[]>('chats', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public createChat(payload: ChatCreateRequestParamsType) {
    return this.post<ChatCreateResponseType>('chats', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public removeChat(payload: ChatRemoveRequestParamsType) {
    return this.post<ChatRemoveResponseType>('chats', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public fetchUsers(payload: ChatUsersRequestParamsType) {
    const { chatId, ...restPayload } = payload

    return this.get<ChatUsersResponseType>(`chats/${chatId}/users`, {
      data: restPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public fetchNewCountMessages(payload: ChatNewMessagesCountRequestParamsType) {
    return this.get<ChatNewMessagesCountResponseType>(
      `chats/new/${payload.chatId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

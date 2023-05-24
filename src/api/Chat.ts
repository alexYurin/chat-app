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

export type ChatAddRemoveUsersRequestParamsType = {
  users: number[]
  chatId: number
}

export type ChatAddRemoveUsersResponseType = string

export type ChatChangeAvatarRequestParamsType = FormData

export type ChatChangeAvatarResponseType = ChatContactType

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

export type ChatTokenRequestParamsType = {
  chatId: number
}

export type ChatTokenResponseType = {
  token: string
}

export default class ChatApi extends BaseApi {
  public fetchChats(payload: ChatsRequestParamsType) {
    return this.get<ChatContactType[]>('chats', {
      data: payload,
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

  public addUsersToChat(payload: ChatAddRemoveUsersRequestParamsType) {
    return this.put<ChatAddRemoveUsersResponseType>('chats/users', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public removeUsersFromChat(payload: ChatAddRemoveUsersRequestParamsType) {
    return this.delete<ChatAddRemoveUsersResponseType>('chats/users', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public changeChatAvatar(payload: ChatChangeAvatarRequestParamsType) {
    return this.put<ChatChangeAvatarResponseType>('chats/avatar', {
      data: payload,
    })
  }

  public removeChat(payload: ChatRemoveRequestParamsType) {
    return this.delete<ChatRemoveResponseType>('chats', {
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
    })
  }

  public fetchNewCountMessages(payload: ChatNewMessagesCountRequestParamsType) {
    return this.get<ChatNewMessagesCountResponseType>(
      `chats/new/${payload.chatId}`
    )
  }

  public fetchChatToken(payload: ChatTokenRequestParamsType) {
    return this.post<ChatTokenResponseType>(`chats/token/${payload.chatId}`)
  }
}

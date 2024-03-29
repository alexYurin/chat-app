import { UserType } from 'types/user'
import { SocketClient } from 'services/index'

export type ChatMessageType = {
  id: number
  chat_id: number
  time: string
  type: string
  user_id: number
  content: string
  file?: {
    id: number
    user_id: number
    path: string
    filename: string
    content_type: string
    content_size: number
    upload_date: string
  }
}

export type ChatContactType = {
  id: number
  title: string
  avatar: string | null
  unread_count: number
  last_message: {
    user?: UserType
    time: string
    content: string
  } | null
}

export type ChatContactRoomType = {
  isActive: boolean
  isConnected?: boolean
  detail: ChatContactType
  users: UserType[]
  client: SocketClient
}

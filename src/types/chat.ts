import { UserType } from 'types/user'
import { SocketClient } from 'services/index'

export type ChatMessageType = {
  chat_id: number
  time: string
  type: string
  user_id: string
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
    user: UserType
    time: string
    content: string
  } | null
}

export type ChatContactItemType = {
  isActive?: boolean
  detail: ChatContactType
  users?: UserType[]
  client?: SocketClient
}

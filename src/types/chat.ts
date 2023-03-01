import { UserType } from 'types/user'

export type ChatContactType = {
  id: number
  title: string
  avatar: string
  unread_count: number
  last_message: {
    user: UserType
    time: string
    content: string
  }
}

export type ChatContactItemType = {
  isActive?: boolean
  detail: ChatContactType
}

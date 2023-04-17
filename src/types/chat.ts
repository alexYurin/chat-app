import { UserType } from 'types/user'

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
}

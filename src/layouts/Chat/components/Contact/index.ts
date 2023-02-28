import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import Avatar, { AvatarProps } from 'components/Avatar'
import templateString from 'bundle-text:./template.pug'

import avatarPlaceholderSrc from 'data-url:static/images/avatar-placeholder.svg'
import './styles.scss'

export interface ChatContactProps extends BaseComponentProps {
  isActive?: boolean
  avatar: AvatarProps
  name: string
  unread?: number
  lastMessage: {
    text: string
    date: string
  }
}

export default class ChatContact extends BaseComponent<ChatContactProps> {
  protected template = templateString

  static defaultAvatarSrc = avatarPlaceholderSrc

  constructor(props: ChatContactProps) {
    super('chatContact', props)

    this.init()
  }

  protected init() {
    const { avatar, name, lastMessage, unread } = this.props
    const unreadCount = `${unread ?? ''}`

    this.props.children = [
      new Avatar({
        ...avatar,
        className: 'contact__avatar',
      }),
      name,
      lastMessage.text,
      lastMessage.date,
      unreadCount,
    ]
  }
}

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import Avatar from 'components/Avatar'
import { ChatContactType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'

import avatarPlaceholderSrc from 'data-url:static/images/avatar-placeholder.svg'
import './styles.scss'

export interface ChatContactProps extends BaseComponentProps {
  isActive?: boolean
  detail: ChatContactType
}

const RESOURCES_URL = process.env.RESOURCES_URL as string

export default class ChatContact extends BaseComponent<ChatContactProps> {
  protected template = templateString

  static defaultAvatarSrc = avatarPlaceholderSrc

  constructor(props: ChatContactProps) {
    super('chatContact', props)

    this.init()
  }

  protected init() {
    const { title, avatar, unread_count, last_message } = this.props.detail
    const unreadCount = `${unread_count ?? ''}`

    this.props.children = [
      new Avatar({
        src: `${RESOURCES_URL}${avatar}`,
        alt: title,
        className: 'contact__avatar',
      }),
      title,
      last_message.content,
      last_message.time,
      unreadCount,
    ]
  }
}

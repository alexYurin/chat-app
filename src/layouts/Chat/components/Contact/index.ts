import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Avatar, Button, Image } from 'components/index'
import { ChatContactType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'
import removeIconSrc from 'data-url:static/images/remove.svg'

import './styles.scss'

export interface ChatContactProps extends BaseComponentProps {
  isActive?: boolean
  detail: ChatContactType
}

const RESOURCES_URL = process.env.RESOURCES_URL as string

export default class ChatContact extends BaseComponent<ChatContactProps> {
  protected template = templateString

  constructor(props: ChatContactProps) {
    super('chatContact', props)

    this.init()
  }

  protected init() {
    const { title, avatar, unread_count, last_message } = this.props.detail

    const avatarSrc = avatar
      ? `${RESOURCES_URL}${avatar}`
      : Avatar.defaultAvatarSrc
    const unreadCount = `${unread_count || ''}`

    this.props.children = [
      new Avatar({
        src: avatarSrc,
        alt: title,
        className: 'contact__avatar',
      }),
      title,
      last_message?.content || '',
      last_message?.time || '',
      unreadCount,
      new Button({
        className: 'contact__remove-button',
        children: [
          new Image({
            src: removeIconSrc,
            alt: 'remove contact',
          }),
        ],
      }),
    ]
  }
}

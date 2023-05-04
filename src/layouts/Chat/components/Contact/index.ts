import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Avatar, Button, Image } from 'components/index'
import { ChatContactItemType } from 'types/chat'
import { store } from 'services/index'
import { parseDateToTime } from 'utils/index'
import templateString from 'bundle-text:./template.pug'
import removeIconSrc from 'data-url:static/images/remove.svg'

import './styles.scss'

export interface ChatContactProps
  extends BaseComponentProps,
    ChatContactItemType {}

const RESOURCES_URL = process.env.RESOURCES_URL as string

export default class ChatContact extends BaseComponent<ChatContactProps> {
  protected template = templateString
  protected disableRenderPropsList = ['isActive']

  constructor(props: ChatContactProps) {
    super('chatContact', props)

    this.init()
  }

  protected onUpdateProps(
    propKey: keyof ChatContactProps,
    prevProp: unknown,
    newProp: unknown
  ): boolean {
    switch (propKey) {
      case 'isActive': {
        const HTMLContact = this.getDOMElement()

        HTMLContact.classList[newProp ? 'add' : 'remove']('contact_active')

        return false
      }

      default:
        return false
    }
  }

  protected init() {
    const { user } = store.getState()
    const { users } = this.props
    const { title, avatar, unread_count, last_message } = this.props.detail

    const chatCurrentUser = users.find(
      (currentUser) => currentUser.id === user?.id
    )

    const chatContactUser = users.find(
      (contactUser) => contactUser.id !== user?.id
    )

    const chatUserAvatarSrc =
      users.length === 2 && chatContactUser?.avatar
        ? `${RESOURCES_URL}${chatContactUser.avatar}`
        : Avatar.defaultAvatarSrc

    const avatarSrc = avatar ? `${RESOURCES_URL}${avatar}` : chatUserAvatarSrc

    const unreadCount = `${unread_count || ''}`

    const time = last_message
      ? parseDateToTime(new Date(last_message?.time))
      : ''

    const removeButton = new Button({
      className: 'contact__remove-button',
      children: [
        new Image({
          src: removeIconSrc,
          alt: 'remove contact',
        }),
      ],
    })

    this.props.children = [
      new Avatar({
        src: avatarSrc,
        alt: title,
        className: 'contact__avatar',
      }),
      title,
      last_message?.content || '',
      time,
      unreadCount,
      chatCurrentUser?.role === 'admin' ? removeButton : '',
    ]
  }
}

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Avatar, Button, Image } from 'components/index'
import { store } from 'services/index'
import { UserType } from 'types/user'
import { isEquals, isFunction } from 'utils/index'

import templateString from './template.pug'
import removeIconSrc from 'static/images/remove.svg'
import './styles.scss'

export interface ChatUserDetailProps extends BaseComponentProps {
  detail: UserType
  onRemove?: (userId: number) => void
}

const RESOURCES_URL = process.env.RESOURCES_URL as string

export default class ChatUserDetail extends BaseComponent<ChatUserDetailProps> {
  protected template = templateString
  protected disableRenderPropsList = ['detail']

  constructor(props: ChatUserDetailProps) {
    super('chatUserDetail', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatUserDetailProps,
    prevProp: unknown,
    newProp: unknown
  ): boolean {
    switch (propKey) {
      case 'detail': {
        if (!isEquals(prevProp, newProp)) {
          this.init()

          return true
        }

        return false
      }

      default:
        return false
    }
  }

  private onRemove() {
    if (isFunction(this.props.onRemove)) {
      this.props.onRemove(this.props.detail.id as number)
    }
  }

  protected init() {
    const { detail } = this.props

    const currentUser = store.getState().user

    const avatarSrc = detail.avatar
      ? `${RESOURCES_URL}/${detail.avatar}`
      : Avatar.defaultAvatarSrc

    const userName = detail.display_name || detail.login

    const buttonContent =
      currentUser?.id === detail.id
        ? 'Покинуть чат'
        : new Image({ src: removeIconSrc, alt: 'remove users' })

    this.props.children = [
      new Avatar({
        src: avatarSrc,
        alt: userName,
        className: 'user-detail__avatar',
      }),
      userName,
      new Button({
        children: [buttonContent],
        className: 'user-detail__button',
        listeners: [
          {
            eventType: 'click',
            callback: this.onRemove.bind(this),
          },
        ],
      }),
    ]
  }
}

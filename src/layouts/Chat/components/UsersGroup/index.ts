import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { ChatContactRoomType } from 'types/chat'
import templateString from './template.pug'
import { Avatar } from 'components/index'
import { isEquals } from 'utils/index'

import './styles.scss'

export interface ChatUsersGroupProps extends BaseComponentProps {
  currentContact?: ChatContactRoomType | null
}

const RESOURCES_URL = process.env.RESOURCES_URL as string

export default class ChatUsersGroup extends BaseComponent<ChatUsersGroupProps> {
  protected template = templateString
  protected disableRenderPropsList = ['currentContact']

  constructor(props: ChatUsersGroupProps) {
    super('chatUsersGroup', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatUsersGroupProps,
    prevProp: unknown,
    newProp: unknown
  ): boolean {
    switch (propKey) {
      case 'currentContact': {
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

  protected init() {
    const { currentContact } = this.props

    const users = currentContact?.users || []

    if (users) {
      this.props.children = users.map((user) => {
        const avatarScr = user.avatar
          ? `${RESOURCES_URL}/${user.avatar}`
          : Avatar.defaultAvatarSrc

        const title = user.display_name || user.login

        return new Avatar({
          title,
          src: avatarScr,
          alt: title,
        })
      })
    }
  }
}

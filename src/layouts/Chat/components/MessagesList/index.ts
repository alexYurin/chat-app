import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { ChatMessage } from 'layouts/Chat/components/index'
import { ChatMessageType } from 'types/chat'
import { isEquals } from 'utils/index'

import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface ChatMessagesListProps extends BaseComponentProps {
  items?: ChatMessageType[]
}

export default class ChatMessagesList extends BaseComponent<ChatMessagesListProps> {
  protected template = templateString

  constructor(props: ChatMessagesListProps) {
    super('chatMessagesList', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatMessagesListProps,
    prevProp: unknown,
    newProp: unknown
  ): boolean {
    switch (propKey) {
      case 'items': {
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
    const { user, items } = this.props

    this.props.children = items?.map((message) => {
      return new ChatMessage({
        isAuthor: user?.id === message.user_id,
        message,
      })
    })
  }
}

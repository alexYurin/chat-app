import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import ChatContact, { ChatContactProps } from 'layouts/Chat/components/Contact'
import { isEquals } from 'utils/index'
import { ChatContactItemType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface ChatMessageListProps extends BaseComponentProps {
  items?: ChatContactItemType[]
  onChangeContact?: (contact: ChatContactProps) => void
  onRemoveChat?: (chatId: number) => void
}

const PREFIX_CHAT_ID = 'id_'

export default class ChatMessageList extends BaseComponent<ChatMessageListProps> {
  protected template = templateString

  constructor(props: ChatMessageListProps) {
    super('chatMessageList', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatMessageListProps,
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
    const { items } = this.props

    if (items) {
      this.props.children = items.map((item) => {
        return new ChatContact({
          ...item,
          id: `${PREFIX_CHAT_ID}${item.detail.id}`,
        })
      })
    }
  }
}

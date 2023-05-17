import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { ChatMessage } from 'layouts/Chat/components/index'
import { ChatMessageType } from 'types/chat'
import { isEquals, first } from 'utils/index'

import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface ChatMessagesListProps extends BaseComponentProps {
  items?: ChatMessageType[]
  lastMessageId?: string
}

export default class ChatMessagesList extends BaseComponent<ChatMessagesListProps> {
  protected template = templateString
  protected disableRenderPropsList = ['items']

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
          const prevMessages = prevProp as ChatMessageType[]
          const currentContact = this.props.currentContact
          const messageOnce = first(prevMessages)

          const isNotCurrent =
            currentContact?.detail.id !== messageOnce?.chat_id

          if (isNotCurrent) {
            this.setProps({
              lastMessageId: undefined,
            })
          }

          this.init()

          return true
        }

        return false
      }

      default:
        return false
    }
  }

  protected onMount() {
    const list = this.getDOMElement()

    if (this.props.lastMessageId) {
      const lastMessage = document.querySelector(`#${this.props.lastMessageId}`)

      lastMessage?.closest('.messages-list__item')?.scrollIntoView({
        block: 'center',
      })

      return
    } else {
      list.scrollTop = list.scrollHeight
    }
  }

  protected init() {
    const { user, items, currentContact } = this.props

    const users = currentContact?.users

    this.props.children = items?.map((message) => {
      const isAuthor = user?.id === message.user_id
      const currentUser = users?.find((_user) => _user.id === message.user_id)
      const userName =
        currentUser?.display_name || (currentUser?.first_name as string)

      return new ChatMessage({
        id: `message__${message.id}`,
        isAuthor,
        userName,
        message,
      })
    })
  }
}

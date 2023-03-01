import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import ChatContact, { ChatContactProps } from 'layouts/Chat/components/Contact'
import { ChatContactItemType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface ChatContactListProps extends BaseComponentProps {
  items?: ChatContactItemType[]
  onChangeContact?: (contact: ChatContactProps) => void
}

export default class ChatContactList extends BaseComponent<ChatContactListProps> {
  protected template = templateString

  constructor(props: ChatContactListProps) {
    super('chatContactList', props)

    this.init()
  }

  protected onChangeContact(event: Event) {
    console.log('event', event)
  }

  protected init() {
    const { items } = this.props

    if (items) {
      this.props.children = items.map((item) => {
        return new ChatContact({
          ...item,
          listeners: [
            {
              eventType: 'click',
              callback: this.onChangeContact,
            },
          ],
        })
      })
    }
  }
}

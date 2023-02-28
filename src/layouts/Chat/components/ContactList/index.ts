import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import ChatContact, { ChatContactProps } from 'layouts/Chat/components/Contact'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

export interface ChatContactListProps extends BaseComponentProps {
  contacts: ChatContactProps[]
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
    const { contacts } = this.props

    this.props.children = contacts.map((contact: ChatContactProps) => {
      return new ChatContact({
        ...contact,
        listeners: [
          {
            eventType: 'click',
            callback: this.onChangeContact,
          },
          ...(contact.listeners || []),
        ],
      })
    })
  }
}

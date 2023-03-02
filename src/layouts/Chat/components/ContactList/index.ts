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
  protected disableRenderPropsList = ['contact']

  constructor(props: ChatContactListProps) {
    super('chatContactList', props)

    this.init()
  }

  protected onChangeContact(event: Event) {
    const contact = event.currentTarget as HTMLElement
    const contactInstance = BaseComponent.findChild(
      contact,
      this.props.children
    )

    if (contactInstance) {
      const contactProps = contactInstance.getProps() as ChatContactProps

      if (typeof this.props.onChangeContact === 'function') {
        this.props.onChangeContact(contactProps)
      }
    }
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
              callback: this.onChangeContact.bind(this),
            },
          ],
        })
      })
    }
  }
}

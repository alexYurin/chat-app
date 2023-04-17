import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import ChatContact, { ChatContactProps } from 'layouts/Chat/components/Contact'
import { ChatContactItemType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'
import { store } from 'services/index'

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

    return this
  }

  protected onChangeContact(event: Event) {
    const contact = event.currentTarget as HTMLElement
    const contactInstance = BaseComponent.findChild<ChatContact>(
      contact,
      this.props.children
    )

    if (contactInstance) {
      const contactProps = contactInstance.getProps() as ChatContactProps

      const { currentContact, contacts } = store.getState()

      const HTMLCurrentContact = document.querySelector(
        `#id_${currentContact?.detail?.id}`
      ) as HTMLElement

      const currenrtContactInstance = ChatContactList.findChild<ChatContact>(
        HTMLCurrentContact,
        this.props.children
      )

      if (currenrtContactInstance?.getProps().id === contactProps.id) {
        return
      }

      currenrtContactInstance?.setProps({
        isActive: false,
      })

      contactInstance.setProps({
        isActive: true,
      })

      store.set(
        'contacts',
        contacts?.map((contact: ChatContactProps) => {
          if (contact.detail.id === contactProps.detail.id) {
            return contactProps
          }

          if (contact.detail.id === currentContact?.detail.id) {
            return currenrtContactInstance?.getProps() || currentContact
          }

          return contact
        })
      )

      store.set('currentContact', contactProps)

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
          id: `id_${item.detail.id}`,
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

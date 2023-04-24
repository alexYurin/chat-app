import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import ChatContact, { ChatContactProps } from 'layouts/Chat/components/Contact'
import { isEquals } from 'utils/index'
import { ChatContactItemType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'
import { store } from 'services/index'

import './styles.scss'

export interface ChatContactListProps extends BaseComponentProps {
  items?: ChatContactItemType[]
  onChangeContact?: (contact: ChatContactProps) => void
  onRemoveChat?: (chatId: number) => void
}

const PREFIX_CHAT_ID = 'id_'

export default class ChatContactList extends BaseComponent<ChatContactListProps> {
  protected template = templateString

  constructor(props: ChatContactListProps) {
    super('chatContactList', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatContactListProps,
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

  protected onChangeContact(event: Event) {
    const target = event.target as HTMLElement
    const contact = event.currentTarget as HTMLElement

    const contactInstance = BaseComponent.findChild<ChatContact>(
      contact,
      this.props.children
    )

    const HTMLRemoveButton = target.closest('.contact__remove-button')

    if (HTMLRemoveButton) {
      if (typeof this.props.onRemoveChat === 'function') {
        const id =
          contactInstance?.getProps()?.id?.replace(PREFIX_CHAT_ID, '') || ''

        this.props.onRemoveChat(parseInt(id))
      }

      return
    }

    if (contactInstance) {
      const contactProps = contactInstance.getProps() as ChatContactProps

      const { currentContact, contacts } = store.getState()

      const HTMLCurrentContact = document.querySelector(
        `#${PREFIX_CHAT_ID}${currentContact?.detail?.id}`
      ) as HTMLElement

      const currentContactInstance = ChatContactList.findChild<ChatContact>(
        HTMLCurrentContact,
        this.props.children
      )

      if (currentContactInstance?.getProps().id === contactProps.id) {
        return
      }

      currentContactInstance?.setProps({
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
            return currentContactInstance?.getProps() || currentContact
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
          id: `${PREFIX_CHAT_ID}${item.detail.id}`,
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

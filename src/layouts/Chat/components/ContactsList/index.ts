import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import ChatContact, { ChatContactProps } from 'layouts/Chat/components/Contact'
import { ChatContactRoomType } from 'types/chat'
import templateString from 'bundle-text:./template.pug'
import { store } from 'services/index'
import { Button, Loader } from 'components/index'
import { isEquals, isFunction } from 'utils/index'

import './styles.scss'

export interface ChatContactsListProps extends BaseComponentProps {
  items?: ChatContactRoomType[]
  currentContact?: ChatContactRoomType | null
  onChangeContact?: (contact: ChatContactProps) => void
  onRemoveChat?: (chatId: number) => void
}

export const PREFIX_CHAT_ID = 'id_'

export default class ChatContactsList extends BaseComponent<ChatContactsListProps> {
  protected template = templateString
  protected disableRenderPropsList = ['isLoading', 'items']

  constructor(props: ChatContactsListProps) {
    super('chatContactsList', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatContactsListProps,
    prevProp: unknown,
    newProp: unknown
  ): boolean {
    switch (propKey) {
      case 'isLoading': {
        if (!isEquals(prevProp, newProp)) {
          this.init()

          return true
        }

        return false
      }

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

  private triggerCreateChatForm() {
    const triggerClassname = 'chat-layout__create-form_active'

    const formContainer = document.querySelector('.chat-layout__create-form')
    const isVisible = formContainer?.classList.contains(triggerClassname)

    formContainer?.classList[isVisible ? 'remove' : 'add'](triggerClassname)
  }

  private onChangeContact(event: Event) {
    const target = event.target as HTMLElement
    const contact = event.currentTarget as HTMLElement

    const { currentContact, contacts } = store.getState()

    const contactInstance = BaseComponent.findChild<ChatContact>(
      contact,
      this.props.children
    )

    const HTMLRemoveButton = target.closest('.contact__remove-button')

    if (HTMLRemoveButton) {
      if (isFunction(this.props.onRemoveChat)) {
        const id =
          contactInstance?.getProps()?.id?.replace(PREFIX_CHAT_ID, '') || ''

        this.props.onRemoveChat(parseInt(id))
      }

      return
    }

    if (
      `${PREFIX_CHAT_ID}${currentContact?.detail.id}` ===
      contactInstance?.getProps().id
    ) {
      return
    }

    if (contactInstance) {
      if (currentContact) {
        const HTMLCurrentContact = document.getElementById(
          `${PREFIX_CHAT_ID}${currentContact.detail.id}`
        ) as HTMLElement

        const contactContactInstance = BaseComponent.findChild<ChatContact>(
          HTMLCurrentContact,
          this.props.children
        )

        currentContact.client?.close()

        contactContactInstance?.setProps({
          isActive: false,
        })
      }

      contactInstance.setProps({
        isActive: true,
      })

      const { id, client, detail, users, isActive, isLoading, isConnected } =
        contactInstance.getProps()

      const contactProps = {
        id,
        client,
        detail,
        users,
        isActive,
        isLoading,
        isConnected,
      }

      store.set('currentContact', contactProps)

      store.set(
        'contacts',
        contacts?.map((storeContact) => {
          if (storeContact.detail.id === currentContact?.detail.id) {
            storeContact.isActive = currentContact.isActive
          }

          if (storeContact.detail.id === contactProps.detail.id) {
            storeContact.isActive = contactProps.isActive
          }

          return storeContact
        })
      )

      if (isFunction(this.props.onChangeContact)) {
        this.props.onChangeContact(contactProps)
      }
    }
  }

  protected init() {
    const { items, isLoading, currentContact } = this.props

    if (items) {
      this.props.children = [
        new Loader({
          className: 'chat-layout__contacts-loader',
          isVisible: isLoading,
          withOverlay: true,
        }),
        new Button({
          status: 'primary',
          type: 'button',
          children: ['Создать чат'],
          className: 'chat-layout__contacts-add-button',
          listeners: [
            {
              eventType: 'click',
              callback: this.triggerCreateChatForm.bind(this),
            },
          ],
        }),
        ...items.map((item) => {
          return new ChatContact({
            ...item,
            isLoading: false,
            isActive: currentContact?.detail.id === item.detail.id,
            id: `${PREFIX_CHAT_ID}${item.detail.id}`,
            listeners: [
              {
                eventType: 'click',
                callback: this.onChangeContact.bind(this),
              },
            ],
          })
        }),
      ]
    }
  }
}

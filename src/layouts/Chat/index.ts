import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import { UserType } from 'types/user'
import { ChatContactRoomType, ChatMessageType } from 'types/chat'
import ChatContact, { ChatContactProps } from './components/Contact'
import { Router } from 'router/index'
import { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { LoaderProps } from 'components/Loader'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'
import { first, isEquals } from 'utils/index'
import withLoading from './withLoading'
import {
  ChatContactsList,
  ChatCreateForm,
  ChatRemoveForm,
  ChatProfileForm,
  ChatMessagesList,
  ChatMessageInput,
  ChatMessage,
  ChatUsersGroup,
  ChatUsersForm,
} from './components'
import { Input, Avatar, Loader, BaseComponent } from 'components/index'
import { PREFIX_CHAT_ID } from './components/ContactsList/index'
import SocketClient from 'services/SocketClient'

import './styles.scss'

const RESOURCES_URL = process.env.RESOURCES_URL as string

class ChatLayout extends BaseLayout<ChatPropsType> {
  protected template = layout
  protected disableRenderPropsList = [
    'user',
    'messages',
    'contacts',
    'currentContact',
    'isLoading',
    'isVisibleMessageInput',
    'isVisibleContacts',
    'isLoadingContacts',
    'isLoadingProfile',
    'isLoadingCreateChatForm',
    'isLoadingRemoveChatForm',
    'isLoadingUsersChatForm',
    'isLoadingMessagesList',
  ]

  private controller: ChatController
  private messageOffset = 0
  private clientPingTimer: NodeJS.Timer | null = null

  constructor(name: string, props: ChatPropsType) {
    super(name, props)
    this.controller = new ChatController({
      onOpenSocket: this.onOpenSocket.bind(this),
      onGetMessage: this.onGetMessage.bind(this),
      onGetMessages: this.onGetMessages.bind(this),
    })

    this.fetchContacts()
    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatPropsType,
    prevValue: unknown,
    newValue: unknown
  ): boolean {
    if (isEquals(prevValue, newValue)) {
      return false
    }

    if (this.disableRenderPropsList.includes(propKey)) {
      switch (propKey) {
        case 'isLoading': {
          if (this.props.isLoadingProfile) {
            return false
          }

          return false
        }

        case 'user': {
          const updatedUser = newValue as UserType

          if (updatedUser === null) {
            return false
          }

          const profileForm = document.querySelector(
            '.chat-layout__profile'
          ) as HTMLElement

          const profileFormInstance = BaseComponent.findChild<ChatProfileForm>(
            profileForm,
            this.props.children
          )

          profileFormInstance?.setProps({
            user: updatedUser,
          })

          const profileAvatar = document
            .querySelector('.chat-layout__trigger_profile')
            ?.querySelector('.avatar')

          if (profileAvatar instanceof HTMLImageElement) {
            const profileAvatarInstance = BaseComponent.findChild<Avatar>(
              profileAvatar,
              this.props.children
            )

            profileAvatarInstance?.setProps({
              src: `${RESOURCES_URL}${updatedUser.avatar}`,
            })
          }

          return false
        }

        case 'messages': {
          const updatedMessages = newValue as ChatMessageType[]

          const messagesList = document.querySelector(
            '.messages-list'
          ) as HTMLElement

          const messagesListInstance =
            BaseComponent.findChild<ChatMessagesList>(
              messagesList,
              this.props.children
            )

          messagesListInstance?.setProps({
            items: updatedMessages,
          })

          const serviceText = document.querySelector(
            '.chat-layout__service-text_chat'
          )

          serviceText?.classList[
            updatedMessages.length === 0 && this.props.currentContact
              ? 'add'
              : 'remove'
          ]('chat-layout__service-text_chat_active')

          return false
        }

        case 'currentContact': {
          const updatedCurrentContact = newValue as
            | ChatContactRoomType
            | undefined

          const messagesList = document.querySelector(
            '.messages-list'
          ) as HTMLElement

          const usersGroup = document.querySelector(
            '.users-group'
          ) as HTMLElement

          const usersForm = document.querySelector('.chat-users') as HTMLElement

          const messagesListInstance =
            BaseComponent.findChild<ChatMessagesList>(
              messagesList,
              this.props.children
            )

          const usersGroupInstance = BaseComponent.findChild<ChatUsersGroup>(
            usersGroup,
            this.props.children
          )

          const usersFormInstance = BaseComponent.findChild<ChatUsersForm>(
            usersForm,
            this.props.children
          )

          messagesListInstance?.setProps({
            currentContact: updatedCurrentContact,
          })

          usersGroupInstance?.setProps({
            currentContact: updatedCurrentContact,
          })

          usersFormInstance?.setProps({
            currentContact: updatedCurrentContact,
            users: updatedCurrentContact?.users,
          })

          if (!updatedCurrentContact) {
            this.setProps({
              isVisibleMessageInput: false,
            })
          }

          this.showMessagesListLoader(false)

          return false
        }

        case 'contacts': {
          const updatedContacts = newValue as ChatContactRoomType[] | undefined

          if (updatedContacts) {
            const contactsList = document.querySelector(
              '.chat-layout__contacts'
            ) as HTMLElement

            const contactsListInstance = BaseLayout.findChild<ChatContactsList>(
              contactsList,
              this.props.children
            )

            contactsListInstance?.setProps({
              items: updatedContacts,
            })

            if (updatedContacts.length === 0) {
              this.setProps({
                isVisibleMessageInput: false,
              })
            }
          }

          return false
        }

        case 'isVisibleContacts': {
          const chatContent = document.querySelector(
            '.chat-layout__content'
          ) as HTMLElement

          chatContent?.classList[newValue ? 'add' : 'remove'](
            'chat-layout__content_contacts_active'
          )

          return false
        }

        case 'isLoadingContacts': {
          const isLoading = newValue as boolean

          const contactsList = document.querySelector(
            '.chat-layout__contacts'
          ) as HTMLElement

          const contactsListInstance = BaseLayout.findChild<ChatContactsList>(
            contactsList,
            this.props.children
          )

          const contacts = this.props.contacts as []

          this.setProps({ isVisibleContacts: contacts.length > 0 })

          contactsListInstance?.setProps({
            isLoading,
          })

          return false
        }

        case 'isLoadingCreateChatForm': {
          const isLoading = newValue as boolean

          const createChatForm = document.querySelector(
            '.chat-create'
          ) as HTMLElement

          const createChatFormComponent = BaseLayout.findChild<Loader>(
            createChatForm,
            this.props.children
          )

          createChatFormComponent?.setProps<LoaderProps>({
            isLoading,
          })

          return false
        }

        case 'isLoadingRemoveChatForm': {
          const isLoading = newValue as boolean
          const removeChatForm = document.querySelector(
            '.chat-remove'
          ) as HTMLElement

          const removeChatFormComponent = BaseLayout.findChild<Loader>(
            removeChatForm,
            this.props.children
          )

          removeChatFormComponent?.setProps<LoaderProps>({
            isLoading,
          })

          return false
        }

        case 'isLoadingUsersChatForm': {
          const isLoading = newValue as boolean
          const usersChatForm = document.querySelector(
            '.chat-users'
          ) as HTMLElement

          const usersChatFormComponent = BaseLayout.findChild<Loader>(
            usersChatForm,
            this.props.children
          )

          usersChatFormComponent?.setProps<LoaderProps>({
            isLoading,
          })

          return false
        }

        case 'isLoadingProfile': {
          const isLoading = newValue as boolean

          const profileForm = document.querySelector(
            '.chat-layout__profile'
          ) as HTMLElement

          const profileFormInstance = BaseComponent.findChild<ChatProfileForm>(
            profileForm,
            this.props.children
          )

          profileFormInstance?.setProps({
            isLoading,
          })

          return false
        }

        case 'isLoadingMessagesList': {
          const isVisible = newValue as boolean

          const messagesListLoader = document.querySelector(
            '.chat-layout__loader-messages'
          ) as HTMLElement

          const messagesListLoaderInstance = BaseComponent.findChild<Loader>(
            messagesListLoader,
            this.props.children
          )

          messagesListLoaderInstance?.setProps({
            isVisible,
          })

          return false
        }

        case 'isVisibleMessageInput': {
          const container = document.querySelector(
            '.chat-layout__content'
          ) as HTMLElement

          container?.classList[newValue ? 'add' : 'remove'](
            'chat-layout__content_input_active'
          )

          return false
        }

        default:
          console.log(
            `Unhandled prop "${propKey}" in skip re-render with values: ${prevValue}, ${newValue}`
          )

          return false
      }
    }

    return false
  }

  private getContactComponentById(chatId: number) {
    const chatContact = document.querySelector(
      `#${PREFIX_CHAT_ID}${chatId}`
    ) as HTMLElement

    return BaseComponent.findChild<ChatContact>(
      chatContact,
      this.props.children
    )
  }

  private setConnectedAllContacts(isConnected: boolean) {
    this.props.contacts?.forEach((contact) => {
      this.setConnectedContact(contact.detail.id, isConnected)
    })
  }

  private setConnectedContact(chatId: number, isConnected: boolean) {
    const chatContactInstance = this.getContactComponentById(chatId)

    chatContactInstance?.setProps({
      isConnected,
      isLoading: !isConnected,
    })
  }

  private onOpenSocket(chatId: number, client: SocketClient) {
    this.setConnectedContact(chatId, true)

    if (this.clientPingTimer) {
      clearInterval(this.clientPingTimer)
    }

    this.clientPingTimer = setInterval(() => {
      client.ping()
    }, 1000)
  }

  private onGetMessage(chatId: number, message: ChatMessageType) {
    const { currentContact } = this.props
    const chatContactInstance = this.getContactComponentById(chatId)
    const contactProps = chatContactInstance?.getProps()

    if (contactProps) {
      const unreadCountMessages =
        currentContact?.detail.id !== chatId
          ? (contactProps.detail.unread_count ?? 0) + 1
          : 0

      chatContactInstance?.setProps({
        detail: {
          ...contactProps.detail,
          unread_count: unreadCountMessages,
          last_message: {
            user: contactProps.detail.last_message?.user,
            time: message.time,
            content: message.content,
          },
        },
      })
    }
  }

  private onGetMessages() {
    this.showMessagesListLoader(false)
  }

  private onSendMessage(message: string) {
    const { currentContact } = this.getProps()

    const listMessages = document.querySelector('.messages-list') as HTMLElement

    const listMessagesInstance = BaseComponent.findChild<ChatMessagesList>(
      listMessages,
      this.props.children
    )

    listMessagesInstance?.setProps({
      lastMessageId: undefined,
    })

    currentContact?.client.sendMessage(message)

    this.messageOffset += 1
  }

  private async onChangeContact(params: ChatContactProps) {
    const chatContactInstance = this.getContactComponentById(params.detail.id)
    const contactProps = chatContactInstance?.getProps()

    this.showMessagesListLoader(true)

    if (contactProps) {
      chatContactInstance?.setProps({
        detail: {
          ...contactProps.detail,
          unread_count: 0,
        },
      })
    }

    if (params.client === undefined && this.props.currentContact) {
      const client = await this.controller.connectToChat(params.detail.id)

      this.props.currentContact.client = client
    } else {
      params.client.getHistory(0)
    }

    if (!this.props.isVisibleMessageInput) {
      this.setProps({
        isVisibleMessageInput: true,
      })
    }
  }

  private showMessagesListLoader(isLoading: boolean) {
    this.setProps({
      isLoadingMessagesList: isLoading,
    })
  }

  private onScrollMessagesList(event: Event) {
    const list = event.target as HTMLElement
    const isScrollTop = list.scrollTop === 0

    if (isScrollTop) {
      const { currentContact } = this.props

      const listInstance = BaseComponent.findChild<ChatMessagesList>(
        list,
        this.props.children
      )

      const topMessageInstance = first(
        listInstance?.getChildren() || []
      ) as ChatMessage

      const lastMessageElementId = topMessageInstance?.getDOMElement().id

      const lastMessageIdString = lastMessageElementId.replace('message__', '')

      const lastMessageId = Number(lastMessageIdString)

      listInstance?.setProps({
        lastMessageId: lastMessageElementId,
      })

      this.showMessagesListLoader(true)

      currentContact?.client.getHistory(lastMessageId + this.messageOffset)

      this.messageOffset = 0
    }
  }

  private onChangeTriggerProfile(event: Event) {
    const inputTrigger = event.target as HTMLInputElement

    console.log(inputTrigger)

    Router.navigate
  }

  private triggerUsersGroupForm() {
    const triggerClassname = 'chat-layout__users-form_active'

    const formContainer = document.querySelector('.chat-layout__users-form')
    const isVisible = formContainer?.classList.contains(triggerClassname)

    formContainer?.classList[isVisible ? 'remove' : 'add'](triggerClassname)
  }

  private triggerCreateChatForm() {
    const triggerClassname = 'chat-layout__create-form_active'

    const formContainer = document.querySelector('.chat-layout__create-form')
    const isVisible = formContainer?.classList.contains(triggerClassname)

    formContainer?.classList[isVisible ? 'remove' : 'add'](triggerClassname)
  }

  private triggerRemoveChatForm(chatId?: number) {
    const triggerClassname = 'chat-layout__remove-form_active'

    const formContainer = document.querySelector('.chat-layout__remove-form')
    const isVisible = formContainer?.classList.contains(triggerClassname)

    formContainer?.classList[isVisible ? 'remove' : 'add'](triggerClassname)

    if (chatId) {
      formContainer
        ?.querySelector('.chat-remove__form')
        ?.setAttribute('data-chat-id', `${chatId}`)
    }
  }

  @withLoading('isLoadingContacts')
  private async fetchContacts() {
    this.setProps({
      isVisibleMessageInput: false,
    })

    const response = await this.controller.fetchChats()

    return response
  }

  @withLoading('isLoadingProfile')
  private async onChangeProfile(user: UserType) {
    await this.controller.changeProfile(user)
  }

  @withLoading('isLoadingProfile')
  private async onChangePassword(
    values: ProfileChangePasswordRequestParamsType
  ) {
    const response = await this.controller.changePassword(values)

    if (response === 'OK') {
      const passwordTrigger = document.querySelector(
        '#chat-password-trigger'
      ) as HTMLInputElement

      passwordTrigger.checked = false
    }
  }

  @withLoading('isLoadingProfile')
  private async onChangeAvatar(avatar: File) {
    await this.controller.changeAvatar(avatar)
  }

  @withLoading('isLoadingProfile')
  private async onLogout() {
    await this.controller.logout()
  }

  @withLoading('isLoadingCreateChatForm')
  private async onCreateChatSubmit(values: { title: string }) {
    const response = await this.controller.createChat(values)

    if (response === 'OK') {
      this.triggerCreateChatForm()

      await this.fetchContacts()

      this.setConnectedAllContacts(true)
    }

    return response
  }

  @withLoading('isLoadingRemoveChatForm')
  private async onRemoveChatSubmit(event: Event) {
    event.preventDefault()

    const chatIdAttribute = (event.target as HTMLElement).getAttribute(
      'data-chat-id'
    )

    if (chatIdAttribute) {
      const response = await this.controller.removeChat({
        chatId: parseInt(chatIdAttribute),
      })

      if (response === 'OK') {
        this.triggerRemoveChatForm()

        await this.fetchContacts()

        this.setConnectedAllContacts(true)
      }
    }
  }

  @withLoading('isLoadingUsersChatForm')
  private async onUsersChatSubmit(values: { login: string }) {
    const currentContact = this.props.currentContact

    if (currentContact) {
      const response = await this.controller.AddUserByLoginToChat(
        values.login,
        currentContact.detail.id
      )

      if (response === 'OK') {
        this.triggerUsersGroupForm()

        await this.fetchContacts()

        this.setConnectedAllContacts(true)
      } else {
        const createForm = document.querySelector(
          '.chat-users__form'
        ) as HTMLElement
        const inputs = createForm.querySelectorAll('.input')
        inputs.forEach((input) => {
          const inputComponent = ChatLayout.findChild<Input>(
            input as HTMLElement,
            this.props.children
          )
          if (inputComponent?.getProps().name === 'login') {
            inputComponent?.setProps({
              message: response as string,
              status: 'alert',
            })
          }
        })
      }
    }
  }

  @withLoading('isLoadingUsersChatForm')
  private async onRemoveUser(userId: number, chatId: number) {
    const response = await this.controller.removeUserFromChat(userId, chatId)

    if (response === 'OK') {
      this.triggerUsersGroupForm()

      await this.fetchContacts()

      this.setConnectedAllContacts(true)
    }
  }

  protected init() {
    const {
      user,
      messages,
      contacts,
      currentContact,
      avatar,
      avatarInput,
      profileFields,
      passwordFields,
      messageFields,
      isLoadingContacts,
      isLoadingProfile,
      isLoadingCreateChatForm,
      isLoadingRemoveChatForm,
      isLoadingUsersChatForm,
    } = this.props

    const avatarProps = {
      ...avatar,
      src: user?.avatar ? `${RESOURCES_URL}${user?.avatar}` : avatar.src,
    }

    this.props.children = [
      new Input({
        isCustom: true,
        id: 'chat-profile-trigger',
        type: 'checkbox',
        className:
          'chat-layout__trigger-input chat-layout__trigger-input_profile',
        listeners: [
          {
            eventType: 'change',
            callback: this.onChangeTriggerProfile.bind(this),
          },
        ],
      }),
      new Input({
        isCustom: true,
        id: 'chat-password-trigger',
        type: 'checkbox',
        className:
          'chat-layout__trigger-input chat-layout__trigger-input_password',
      }),
      new Avatar(avatarProps),
      new Loader({
        isVisible: false,
        withOverlay: false,
        className: 'chat-layout__loader-messages',
      }),
      new ChatCreateForm({
        isLoading: isLoadingCreateChatForm,
        className: 'chat-layout__search-users',
        onSubmit: this.onCreateChatSubmit.bind(this),
        onCancel: this.triggerCreateChatForm.bind(this),
      }),
      new ChatRemoveForm({
        isLoading: isLoadingRemoveChatForm,
        className: 'chat-layout__remove-users',
        onSubmit: this.onRemoveChatSubmit.bind(this),
        onCancel: this.triggerRemoveChatForm.bind(this),
      }),
      new ChatUsersForm({
        users: currentContact?.users,
        isLoading: isLoadingUsersChatForm,
        onSubmit: this.onUsersChatSubmit.bind(this),
        onCancel: this.triggerUsersGroupForm.bind(this),
        onRemoveUser: this.onRemoveUser.bind(this),
      }),
      new ChatContactsList({
        currentContact,
        isLoading: isLoadingContacts,
        items: contacts,
        className: 'chat-layout__contacts-list scroll',
        onChangeContact: this.onChangeContact.bind(this),
        onRemoveChat: this.triggerRemoveChatForm.bind(this),
      }),
      new ChatUsersGroup({
        currentContact,
        listeners: [
          {
            eventType: 'click',
            callback: this.triggerUsersGroupForm.bind(this),
          },
        ],
      }),
      new ChatProfileForm({
        user,
        avatar,
        avatarInput,
        profileFields,
        passwordFields,
        isLoading: isLoadingProfile,
        onChangeAvatar: this.onChangeAvatar.bind(this),
        onChangeProfile: this.onChangeProfile.bind(this),
        onChangePassword: this.onChangePassword.bind(this),
        onLogout: this.onLogout.bind(this),
      }),
      new ChatMessagesList({
        user,
        currentContact,
        items: messages,
        listeners: [
          {
            eventType: 'scroll',
            callback: this.onScrollMessagesList.bind(this),
          },
        ],
      }),
      new ChatMessageInput({
        messageFields,
        onSendMessage: this.onSendMessage.bind(this),
      }),
    ]
  }
}

const withState = connect((state) => ({ ...state }))

export default withState<ChatPropsType>(ChatLayout as typeof BaseComponent)

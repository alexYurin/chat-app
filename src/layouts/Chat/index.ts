import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import { UserType } from 'types/user'
import { ChatContactItemType, ChatMessageType } from 'types/chat'
import ChatContact, { ChatContactProps } from './components/Contact'
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
} from './components'
import { PREFIX_CHAT_ID } from './components/ContactsList/index'
import { Input, Avatar, Loader, BaseComponent } from 'components/index'

import './styles.scss'

const RESOURCES_URL = process.env.RESOURCES_URL as string

const PAGE_SIZE = 20

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
    'isLoadingMessagesList',
  ]
  private controller: ChatController

  private pageNumber = 0

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
    if (this.disableRenderPropsList.includes(propKey)) {
      switch (propKey) {
        case 'isLoading': {
          if (this.props.isLoadingProfile) {
            return false
          }

          return false
        }

        case 'user': {
          if (!isEquals(prevValue, newValue)) {
            const updatedUser = newValue as UserType

            const profileForm = document.querySelector(
              '.chat-layout__profile'
            ) as HTMLElement

            const profileFormInstance =
              BaseComponent.findChild<ChatProfileForm>(
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
          }

          return false
        }

        case 'messages': {
          const updatedMessages = newValue as ChatMessageType[]

          if (!isEquals(prevValue, newValue)) {
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
          }

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
          if (!isEquals(prevValue, newValue)) {
            const updatedCurrentContact = newValue as ChatContactItemType

            const messagesList = document.querySelector(
              '.messages-list'
            ) as HTMLElement

            const messagesListInstance =
              BaseComponent.findChild<ChatMessagesList>(
                messagesList,
                this.props.children
              )

            messagesListInstance?.setProps({
              currentContact: updatedCurrentContact,
            })

            if (!updatedCurrentContact) {
              this.setProps({
                isVisibleMessageInput: false,
              })
            }
          }

          return false
        }

        case 'contacts': {
          const updatedContacts = newValue as ChatContactItemType[]

          if (updatedContacts) {
            const contactsList = document.querySelector(
              '.chat-layout__contacts'
            ) as HTMLElement

            const contactsListInstance = BaseLayout.findChild<ChatContactsList>(
              contactsList,
              this.props.children
            )

            this.setProps({ isVisibleContacts: updatedContacts.length > 0 })

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

          chatContent?.classList[
            this.props.isVisibleContacts ? 'add' : 'remove'
          ]('chat-layout__content_contacts_active')

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

          contactsListInstance?.setProps({
            isLoading,
          })

          return false
        }

        case 'isLoadingCreateChatForm': {
          const isVisible = newValue as boolean

          const createChatForm = document.querySelector(
            '.chat-create'
          ) as HTMLElement

          const createChatFormComponent = BaseLayout.findChild<Loader>(
            createChatForm,
            this.props.children
          )

          createChatFormComponent?.setProps<LoaderProps>({
            isLoading: isVisible,
          })

          return false
        }

        case 'isLoadingRemoveChatForm': {
          const isVisible = newValue as boolean
          const removeChatForm = document.querySelector(
            '.chat-remove'
          ) as HTMLElement

          const removeChatFormComponent = BaseLayout.findChild<Loader>(
            removeChatForm,
            this.props.children
          )

          removeChatFormComponent?.setProps<LoaderProps>({
            isLoading: isVisible,
          })

          return false
        }

        case 'isLoadingProfile': {
          if (!isEquals(prevValue, newValue)) {
            const isLoading = newValue as boolean

            const profileForm = document.querySelector(
              '.chat-layout__profile'
            ) as HTMLElement

            const profileFormInstance =
              BaseComponent.findChild<ChatProfileForm>(
                profileForm,
                this.props.children
              )

            profileFormInstance?.setProps({
              isLoading,
            })
          }

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

          container.classList[newValue ? 'add' : 'remove'](
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

  private setLoadingForAllContacts(isLoading: boolean) {
    this.props.contacts?.forEach((contact) => {
      this.setLoadingContact(contact.detail.id, isLoading)
    })
  }

  private setLoadingContact(chatId: number, isLoading: boolean) {
    const chatContactInstance = this.getContactComponentById(chatId)

    chatContactInstance?.setProps({
      isLoading,
    })
  }

  private onOpenSocket(chatId: number) {
    this.setLoadingContact(chatId, false)
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

    this.toDropPage()

    currentContact?.client.sendMessage(message)
  }

  private onChangeContact(params: ChatContactProps) {
    const chatContactInstance = this.getContactComponentById(params.detail.id)
    const contactProps = chatContactInstance?.getProps()

    this.toDropPage()

    if (contactProps) {
      chatContactInstance?.setProps({
        detail: {
          ...contactProps.detail,
          unread_count: 0,
        },
      })
    }

    if (params.client === undefined) {
      this.controller.connectToChat(params.detail.id)
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

  private onScrollMessageList(event: Event) {
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

      const lastMessageId = topMessageInstance?.getDOMElement().id

      listInstance?.setProps({
        lastMessageId,
      })

      this.showMessagesListLoader(true)

      this.pageNumber += 1

      currentContact?.client.getHistory(PAGE_SIZE * this.pageNumber)
    }
  }

  private toDropPage() {
    this.pageNumber = 0
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
  private async onCreateChatSubmit(values: { title: string; login: string }) {
    const response = await this.controller.createChatWithAddUser(
      values.title,
      values.login
    )

    if (response === 'OK') {
      this.triggerCreateChatForm()

      await this.fetchContacts()

      this.setLoadingForAllContacts(false)
    } else {
      const createForm = document.querySelector(
        '.chat-create__form'
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

        this.setLoadingForAllContacts(false)
      }
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
    } = this.props

    const avatarProps = {
      ...avatar,
      src: user?.avatar ? `${RESOURCES_URL}${user?.avatar}` : avatar.src,
    }

    this.props.children = [
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
      new ChatContactsList({
        currentContact,
        isLoading: isLoadingContacts,
        items: contacts,
        className: 'chat-layout__contacts-list scroll',
        onChangeContact: this.onChangeContact.bind(this),
        onRemoveChat: this.triggerRemoveChatForm.bind(this),
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
            callback: this.onScrollMessageList.bind(this),
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

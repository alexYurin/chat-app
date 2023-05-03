import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import { UserType } from 'types/user'
import { ChatContactProps } from './components/Contact'
import { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { LoaderProps } from 'components/Loader'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'
import { isEquals } from 'utils/index'
import withLoading from './withLoading'
import {
  ChatContactsList,
  ChatCreateForm,
  ChatRemoveForm,
  ChatProfileForm,
  ChatMessagesList,
  ChatMessageInput,
} from './components'
import { Input, Avatar, Loader, BaseComponent } from 'components/index'

import './styles.scss'

const RESOURCES_URL = process.env.RESOURCES_URL as string

class ChatLayout extends BaseLayout<ChatPropsType> {
  protected template = layout
  protected disableRenderPropsList = [
    'user',
    'contacts',
    'isLoading',
    'isVisibleMessageInput',
    'isVisibleContacts',
    'isLoadingContacts',
    'isLoadingProfile',
    'isLoadingCreateChatForm',
    'isLoadingRemoveChatForm',
  ]
  private controller: ChatController

  constructor(name: string, props: ChatPropsType) {
    super(name, props)
    this.controller = new ChatController()

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
          if (isEquals(prevValue, newValue)) {
            return false
          }

          this.init()

          return true
        }

        case 'contacts': {
          if (this.props.contacts) {
            const container = document.querySelector('.chat-layout__content')

            const contactsList = document.querySelector(
              '.chat-layout__contacts'
            ) as HTMLElement

            const contactsListInstance = BaseLayout.findChild<ChatContactList>(
              contactsList,
              this.props.children
            )

            contactsListInstance?.setProps({
              items: this.props.contacts,
            })

            this.setProps({ isVisibleContacts: this.props.contacts.length > 0 })

            const isActiveChats = this.props.contacts.some(
              (contact) => contact.isActive
            )

            container?.classList[isActiveChats ? 'add' : 'remove'](
              'chat-layout__content_input_active'
            )

            this.setProps({
              isVisibleMessageInput: isActiveChats,
            })
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

          const contactsListInstance = BaseLayout.findChild<ChatContactList>(
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
          const isVisible = newValue as boolean
          const loader = document.querySelector(
            '.chat-layout__profile-loader'
          ) as HTMLElement

          const loaderComponent = BaseLayout.findChild<Loader>(
            loader,
            this.props.children
          )

          loaderComponent?.setProps<LoaderProps>({
            isVisible,
          })

          return false
        }

        case 'isVisibleMessageInput': {
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

  private onChangeContact(params: ChatContactProps) {
    if (params.token === undefined) {
      this.controller.connectToChat(params.detail.id)
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
      this.fetchContacts()
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
        this.fetchContacts()
      }
    }
  }

  private onSendMessage(message: string) {
    console.log('send message', message)
  }

  protected init() {
    const {
      user,
      contacts,
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
        items: [],
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

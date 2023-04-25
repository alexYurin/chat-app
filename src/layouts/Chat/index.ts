import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import { UserType } from 'types/user'
import { ChatContactProps } from './components/Contact'
import { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { InputProps } from 'components/Input'
import { LoaderProps } from 'components/Loader'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'
import { isEquals } from 'utils/index'
import withLoading from './withLoading'
import {
  ChatContactList,
  ChatCreateForm,
  ChatRemoveForm,
  ChatProfileForm,
} from './components'
import {
  Form,
  Input,
  Button,
  Avatar,
  Loader,
  BaseComponent,
} from 'components/index'

import './styles.scss'

const formMessageId = 'chat-message-form'

const RESOURCES_URL = process.env.RESOURCES_URL as string

class ChatLayout extends BaseLayout<ChatPropsType> {
  protected template = layout
  protected disableRenderPropsList = [
    'user',
    'contacts',
    'isLoading',
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
        case 'user': {
          if (isEquals(prevValue, newValue)) {
            return false
          }

          this.init()

          return true
        }

        case 'contacts': {
          if (this.props.contacts) {
            this.setProps({
              isVisibleContacts: this.props.contacts.length > 0,
            })

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

            return false
          }

          break
        }

        case 'isLoading': {
          if (this.props.isLoadingProfile) {
            break
          }

          break
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

        case 'isLoadingContacts': {
          const isVisible = newValue as boolean
          const loader = document.querySelector(
            '.chat-layout__contacts-loader'
          ) as HTMLElement

          const loaderComponent = BaseLayout.findChild<Loader>(
            loader,
            this.props.children
          )

          loaderComponent?.setProps<LoaderProps>({
            isVisible,
          })

          if (this.props.contacts) {
            this.setProps({
              isVisibleContacts: this.props.contacts.length > 0,
            })
          }

          break
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

          break
        }

        default:
          console.log(
            `Unhandled prop "${propKey}" in skip re-render with values: ${prevValue}, ${newValue}`
          )

          break
      }
    }

    return false
  }

  @withLoading('isLoadingContacts')
  private async fetchContacts() {
    const response = await this.controller.fetchChats()

    return response
  }

  private validate(event: Event, currentInputProps: InputProps) {
    Form.validate(event, currentInputProps, this.props.children)
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

  private createInputListeners(inputProps: InputProps) {
    return [
      {
        eventType: 'blur',
        callback: (event: Event) => this.validate(event, inputProps),
      },
    ]
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

  private onChangeContact(params: ChatContactProps) {
    const container = document.querySelector('.chat-layout__content')

    console.log('onChangeContact', params)

    if (container?.classList.contains('chat-layout__content_input_active')) {
      return
    }

    container?.classList.add('chat-layout__content_input_active')
  }

  @withLoading('isLoadingCreateChatForm')
  private async onCreateChatSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm) {
      const response = await this.controller.createChatWithAddUser(
        values.title,
        values.login
      )

      if (response === 'OK') {
        this.triggerCreateChatForm()
        this.fetchContacts()
      } else {
        const inputs = (event.target as HTMLElement).querySelectorAll('.input')

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

  private onMessageSubmit(event: Event) {
    Form.preSubmitValidate(event, this.props.children)
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
      new ChatCreateForm({
        isLoading: isLoadingCreateChatForm,
        className: 'chat-layout__search-users',
        onValidate: this.validate.bind(this),
        onSubmit: this.onCreateChatSubmit.bind(this),
        onCancel: this.triggerCreateChatForm.bind(this),
      }),
      new ChatRemoveForm({
        isLoading: isLoadingRemoveChatForm,
        className: 'chat-layout__remove-users',
        onSubmit: this.onRemoveChatSubmit.bind(this),
        onCancel: this.triggerRemoveChatForm.bind(this),
      }),
      new ChatContactList({
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
      new Avatar(avatarProps),
      new Form({
        id: formMessageId,
        className: 'chat-layout__message-form chat-layout__form',
        fields: messageFields.map(({ label, input }) => {
          input.listeners = this.createInputListeners(input)

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: this.onMessageSubmit.bind(this),
          },
        ],
      }),
      new Button({
        status: 'primary',
        type: 'submit',
        form: formMessageId,
        className: 'chat-layout__submit-button',
        children: ['Отправить'],
      }),
    ]
  }
}

const withState = connect((state) => ({ ...state }))

export default withState<ChatPropsType>(ChatLayout as typeof BaseComponent)

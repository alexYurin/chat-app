import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import { first } from 'utils/index'
import { ChatContactList, ChatCreateForm, ChatRemoveForm } from './components'
import { ChatContactProps } from './components/Contact'
import { InputProps } from 'components/Input'
import { LoaderProps } from 'components/Loader'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'
import { isEquals } from 'utils/index'
import withLoading from './withLoading'
import {
  Form,
  Input,
  Button,
  Avatar,
  Image,
  Loader,
  BaseComponent,
} from 'components/index'

import editAvatarIconSrc from 'data-url:static/images/edit.svg'
import './styles.scss'

const formMessageId = 'chat-message-form'
const formProfileId = 'chat-profile-form'
const formPasswordId = 'chat-password-form'

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
              '.contact-list'
            ) as HTMLElement

            const contactsListInstance = BaseLayout.findChild<ChatContactList>(
              contactsList,
              this.props.children
            )

            contactsListInstance?.setProps({
              items: this.props.contacts,
            })

            return true
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

  private triggerProfileFormEdit(event: Event) {
    const triggerButton = event.target as HTMLButtonElement

    const form = document.querySelector('.chat-layout__profile-form')
    const action = form?.classList.contains('form_readonly') ? 'remove' : 'add'

    const buttonText = action === 'add' ? 'Изменить данные' : 'Отменить'

    triggerButton.textContent = buttonText
    form?.classList[action]('form_readonly')
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
  private async onProfileSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm) {
      const response = await this.controller.changeProfile(values)

      return response
    }
  }

  @withLoading('isLoadingProfile')
  private async onPasswordSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm) {
      const response = await this.controller.changePassword(values)

      if (response === 'OK') {
        const passwordTrigger = document.querySelector(
          '#chat-password-trigger'
        ) as HTMLInputElement

        passwordTrigger.checked = false
      }
    }
  }

  private onChangeContact(params: ChatContactProps) {
    const container = document.querySelector('.chat-layout__content')

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

  @withLoading('isLoadingProfile')
  private async onChangeAvatar(event: Event) {
    const inputFile = event.target

    if (inputFile instanceof HTMLInputElement && inputFile.files) {
      const file = first(Array.from(inputFile.files)) as File

      const response = await this.controller.changeAvatar(file)

      await response
    }
  }

  @withLoading('isLoadingProfile')
  private async onLogout() {
    await this.controller.logout()
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
        items: contacts,
        className: 'chat-layout__contacts-list scroll',
        onChangeContact: this.onChangeContact.bind(this),
        onRemoveChat: this.triggerRemoveChatForm.bind(this),
      }),
      new Loader({
        className: 'chat-layout__contacts-loader',
        isVisible: isLoadingContacts,
        withOverlay: true,
      }),
      new Loader({
        className: 'chat-layout__profile-loader',
        isVisible: isLoadingProfile,
        withOverlay: true,
      }),
      new Image({
        src: editAvatarIconSrc,
        alt: 'edit-avatar-icon',
        className: 'chat-layout__profile-edit-icon',
      }),
      new Button({
        status: 'primary',
        type: 'button',
        className: 'chat-layout__profile-logout-button',
        children: ['Выйти'],
        listeners: [
          {
            eventType: 'click',
            callback: this.onLogout.bind(this),
          },
        ],
      }),
      new Avatar(avatarProps),
      new Avatar(avatarProps),
      new Input({
        ...avatarInput,
        listeners: [
          {
            eventType: 'change',
            callback: this.onChangeAvatar.bind(this),
          },
        ],
      }),
      new Form({
        id: formProfileId,
        readonly: true,
        className: 'chat-layout__profile-form chat-layout__form scroll',
        fields: profileFields.map(({ label, input }) => {
          input.listeners = this.createInputListeners(input)
          input.value = user
            ? (user[input.name as keyof typeof user] as string)
            : undefined

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: this.onProfileSubmit.bind(this),
          },
        ],
      }),
      new Form({
        id: formPasswordId,
        className: 'chat-layout__password-form chat-layout__form scroll',
        fields: passwordFields.map(({ label, input }) => {
          input.listeners = this.createInputListeners(input)

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: this.onPasswordSubmit.bind(this),
          },
        ],
      }),
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
        type: 'button',
        children: ['Изменить Данные'],
        listeners: [
          {
            eventType: 'click',
            callback: this.triggerProfileFormEdit.bind(this),
          },
        ],
      }),
      new Button({
        status: 'primary',
        type: 'submit',
        form: formProfileId,
        className: 'chat-layout__submit-button',
        children: ['Сохранить'],
      }),
      new Button({
        status: 'primary',
        type: 'submit',
        form: formPasswordId,
        className: 'chat-layout__submit-button',
        children: ['Сохранить'],
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

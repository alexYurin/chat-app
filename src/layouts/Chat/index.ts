import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import { first } from 'utils/index'
import {
  Form,
  Input,
  Button,
  Avatar,
  Image,
  Loader,
  BaseComponent,
} from 'components/index'
import { ChatContactList, ChatCreateForm } from './components'
import { InputProps } from 'components/Input'
import { LoaderProps } from 'components/Loader'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'
import { isEquals } from 'utils/index'

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

            this.init()

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

  protected withLoadingProfile<
    THandlerArgs = unknown,
    THandlerReturn = unknown
  >(
    handler: (...args: THandlerArgs[]) => Promise<THandlerReturn>,
    ...args: unknown[]
  ) {
    return async () => {
      this.setProps({
        isLoadingProfile: true,
      })

      const response = await handler(...args)

      this.setProps({
        isLoadingProfile: false,
      })

      return response
    }
  }

  protected withLoadingCreateChatForm<
    THandlerArgs = unknown,
    THandlerReturn = unknown
  >(
    handler: (...args: THandlerArgs[]) => Promise<THandlerReturn>,
    ...args: unknown[]
  ) {
    return async () => {
      this.setProps({
        isLoadingCreateChatForm: true,
      })

      const response = await handler(...args)

      this.setProps({
        isLoadingCreateChatForm: false,
      })

      return response
    }
  }

  protected withLoadingContacts<
    THandlerArgs = unknown,
    THandlerReturn = unknown
  >(
    handler: (...args: THandlerArgs[]) => Promise<THandlerReturn>,
    ...args: unknown[]
  ) {
    return async () => {
      this.setProps({
        isLoadingContacts: true,
      })

      const response = await handler(...args)

      this.setProps({
        isLoadingContacts: false,
      })

      return response
    }
  }

  private async fetchContacts() {
    const fetchContacts = this.withLoadingContacts(this.controller.fetchChats)

    return await fetchContacts()
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

  private async onProfileSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm) {
      const changeProfile = this.withLoadingProfile(
        this.controller.changeProfile,
        values
      )

      await changeProfile()
    }
  }

  private async onPasswordSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm) {
      const changePassword = this.withLoadingProfile(
        this.controller.changePassword,
        values
      )

      const response = await changePassword()

      if (response === 'OK') {
        const passwordTrigger = document.querySelector(
          '#chat-password-trigger'
        ) as HTMLInputElement

        passwordTrigger.checked = false
      }
    }
  }

  private async onChatCreateSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm) {
      const createChat = this.withLoadingCreateChatForm(
        this.controller.createChat,
        values
      )

      const response = await createChat()

      if (response === 'OK') {
        this.triggerCreateChatForm()
        this.fetchContacts()
      }
    }
  }

  private onMessageSubmit(event: Event) {
    Form.preSubmitValidate(event, this.props.children)
  }

  private async onChangeAvatar(event: Event) {
    const inputFile = event.target

    if (inputFile instanceof HTMLInputElement && inputFile.files) {
      const file = first(Array.from(inputFile.files)) as File
      const changeAvatar = this.withLoadingProfile(
        this.controller.changeAvatar,
        file
      )

      await changeAvatar()
    }
  }

  private async onLogout() {
    const logout = this.withLoadingProfile(this.controller.logout)

    await logout()
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
        onSubmit: this.onChatCreateSubmit.bind(this),
        onCancel: this.triggerCreateChatForm.bind(this),
      }),
      new ChatContactList({
        items: contacts,
        className: 'chat-layout__contacts-list scroll',
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

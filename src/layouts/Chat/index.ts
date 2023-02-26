import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import ChatController from './controller'
import {
  Form,
  Input,
  Button,
  Avatar,
  Image,
  Loader,
  BaseComponent,
} from 'components/index'
import { InputProps } from 'components/Input'
import { LoaderProps } from 'components/Loader'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'

import editAvatarIconSrc from 'data-url:static/images/edit.svg'
import './styles.scss'

const formMessageId = 'chat-message-form'
const formProfileId = 'chat-profile-form'
const formPasswordId = 'chat-password-form'

class ChatLayout extends BaseLayout<ChatPropsType> {
  protected template = layout
  protected disableRenderPropsList = ['user', 'isLoading', 'isLoadingProfile']
  private controller = new ChatController()

  protected onUpdateProps(
    propKey: keyof ChatPropsType,
    prevValue: unknown,
    newValue: unknown
  ): boolean {
    if (this.disableRenderPropsList.includes(propKey)) {
      switch (propKey) {
        case 'isLoading': {
          if (this.props.isLoadingProfile) {
            break
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

  protected withLoadingProfile<THandlerReturn>(
    handler: (...args: unknown[]) => Promise<THandlerReturn>,
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

  init() {
    const {
      avatar,
      avatarInput,
      profileFields,
      passwordFields,
      messageFields,
      isLoadingProfile,
    } = this.props

    const triggerProfileFormEdit = (event: Event) => {
      const triggerButton = event.target as HTMLButtonElement

      const form = document.querySelector('.chat-layout__profile-form')
      const action = form?.classList.contains('form_readonly')
        ? 'remove'
        : 'add'

      const buttonText = action === 'add' ? 'Изменить данные' : 'Отменить'

      triggerButton.textContent = buttonText
      form?.classList[action]('form_readonly')
    }

    const validate = (event: Event, currentInputProps: InputProps) => {
      Form.validate(event, currentInputProps, this.props.children)
    }

    const createInputListeners = (inputProps: InputProps) => [
      {
        eventType: 'blur',
        callback: (event: Event) => validate(event, inputProps),
      },
    ]

    const onProfileSubmit = (event: Event) => {
      const isValidForm = Form.preSubmitValidate(event, this.props.children)

      if (isValidForm) {
        const isRedirect = confirm(
          'Форма успешно отправлена. Перейти в профиль?'
        )
      }
    }

    const onPasswordSubmit = (event: Event) => {
      const isValidForm = Form.preSubmitValidate(event, this.props.children)

      if (isValidForm) {
        const isRedirect = confirm(
          'Форма успешно отправлена. Перейти в профиль?'
        )
      }
    }

    const onMessageSubmit = (event: Event) => {
      Form.preSubmitValidate(event, this.props.children)
    }

    const onLogout = async () => {
      const logout = this.withLoadingProfile(this.controller.logout)

      await logout()
    }

    this.props.children = [
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
            callback: onLogout,
          },
        ],
      }),
      new Avatar(avatar),
      new Avatar(avatar),
      new Input(avatarInput),
      new Form({
        id: formProfileId,
        readonly: true,
        className: 'chat-layout__profile-form chat-layout__form scroll',
        fields: profileFields.map(({ label, input }) => {
          input.listeners = createInputListeners(input)

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: onProfileSubmit,
          },
        ],
      }),
      new Form({
        id: formPasswordId,
        className: 'chat-layout__password-form chat-layout__form scroll',
        fields: passwordFields.map(({ label, input }) => {
          input.listeners = createInputListeners(input)

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: onPasswordSubmit,
          },
        ],
      }),
      new Form({
        id: formMessageId,
        className: 'chat-layout__message-form chat-layout__form',
        fields: messageFields.map(({ label, input }) => {
          input.listeners = createInputListeners(input)

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: onMessageSubmit,
          },
        ],
      }),
      new Button({
        type: 'button',
        children: ['Изменить Данные'],
        listeners: [
          {
            eventType: 'click',
            callback: triggerProfileFormEdit,
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

const withState = connect((state) => ({
  user: state.user,
  isLoading: state.isLoading,
}))

export default withState<ChatPropsType>(ChatLayout as typeof BaseComponent)

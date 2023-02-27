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
  protected disableRenderPropsList = ['user', 'isLoading', 'isLoadingProfile']
  private controller = new ChatController()

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

  protected withLoadingProfile<
    THandlerArgs = unknown[],
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

  init() {
    const {
      user,
      avatar,
      avatarInput,
      profileFields,
      passwordFields,
      messageFields,
      isLoadingProfile,
    } = this.props

    const avatarProps = {
      ...avatar,
      src: user?.avatar ? `${RESOURCES_URL}${user?.avatar}` : avatar.src,
    }

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

    const onProfileSubmit = async (event: Event) => {
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

    const onPasswordSubmit = async (event: Event) => {
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

    const onMessageSubmit = (event: Event) => {
      Form.preSubmitValidate(event, this.props.children)
    }

    const onChangeAvatar = async (event: Event) => {
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
      new Avatar(avatarProps),
      new Avatar(avatarProps),
      new Input({
        ...avatarInput,
        listeners: [
          {
            eventType: 'change',
            callback: onChangeAvatar,
          },
        ],
      }),
      new Form({
        id: formProfileId,
        readonly: true,
        className: 'chat-layout__profile-form chat-layout__form scroll',
        fields: profileFields.map(({ label, input }) => {
          input.listeners = createInputListeners(input)
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

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Form, Input, Button, Image, Avatar, Loader } from 'components/index'
import { ProfileChangePasswordRequestParamsType } from 'api/Profile'
import { InputProps } from 'components/Input'
import { FormProps } from 'components/Form'
import { AvatarProps } from 'components/Avatar'
import { LoaderProps } from 'components/Loader'
import { UserType } from 'types/user'
import { first, isFunction, isEquals } from 'utils/index'
import editAvatarIconSrc from 'static/images/edit.svg'
import templateString from './template.pug'

import './styles.scss'

interface ChatProfileFormProps extends BaseComponentProps {
  avatar: AvatarProps
  avatarInput: InputProps
  profileFields: FormProps['fields']
  passwordFields: FormProps['fields']
  isLoading?: boolean
  onChangeAvatar?: (avatar: File) => void
  onChangeProfile?: (user: UserType) => void
  onChangePassword?: (form: ProfileChangePasswordRequestParamsType) => void
  onLogout?: () => void
}

const formProfileId = 'chat-profile-form'
const formPasswordId = 'chat-password-form'

const RESOURCES_URL = process.env.RESOURCES_URL as string

export default class ChatProfileForm extends BaseComponent<ChatProfileFormProps> {
  protected template = templateString
  protected disableRenderPropsList = ['isLoading', 'user']

  constructor(props: ChatProfileFormProps) {
    super('chatProfile', props)

    this.init()
  }

  protected onUpdateProps(
    propKey: keyof ChatProfileFormProps,
    prevProp: unknown,
    newProp: unknown
  ) {
    if (this.disableRenderPropsList.includes(propKey)) {
      switch (propKey) {
        case 'isLoading': {
          if (!isEquals(prevProp, newProp)) {
            const isVisible = newProp as boolean

            const loader = document.querySelector(
              '.chat-layout__profile-loader'
            ) as HTMLElement

            const loaderComponent = ChatProfileForm.findChild<Loader>(
              loader,
              this.props.children
            )

            loaderComponent?.setProps<LoaderProps>({
              isVisible,
            })
          }

          return false
        }

        case 'user': {
          if (!isEquals(prevProp, newProp)) {
            this.init()

            return true
          }
        }
      }
    }

    return false
  }

  private validate(event: Event, currentInputProps: InputProps) {
    Form.validate(event, currentInputProps, this.props.children)
  }

  private createInputListeners(inputProps: InputProps) {
    return [
      {
        eventType: 'blur',
        callback: (event: Event) => this.validate(event, inputProps),
      },
    ]
  }

  private triggerProfileFormEdit(event: Event) {
    const triggerButton = event.target as HTMLButtonElement

    const form = document.querySelector('.chat-layout__profile-form')
    const action = form?.classList.contains('form_readonly') ? 'remove' : 'add'

    const buttonText = action === 'add' ? 'Изменить данные' : 'Отменить'

    triggerButton.textContent = buttonText
    form?.classList[action]('form_readonly')
  }

  private onChangeAvatar(event: Event) {
    const inputFile = event.target

    if (
      inputFile instanceof HTMLInputElement &&
      inputFile.files &&
      isFunction(this.props.onChangeAvatar)
    ) {
      const file = first(Array.from(inputFile.files)) as File

      this.props.onChangeAvatar(file)
    }
  }

  private onSubmitProfile(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate<UserType>(
      event,
      this.props.children
    )

    if (isValidForm && isFunction(this.props.onChangeProfile)) {
      this.props.onChangeProfile(values)
    }
  }

  private onSubmitPassword(event: Event) {
    const { isValidForm, values } =
      Form.preSubmitValidate<ProfileChangePasswordRequestParamsType>(
        event,
        this.props.children
      )

    if (isValidForm && isFunction(this.props.onChangePassword)) {
      this.props.onChangePassword(values)
    }
  }

  private onLogout() {
    if (isFunction(this.props.onLogout)) {
      this.props.onLogout()
    }
  }

  protected init() {
    const {
      user,
      avatar,
      avatarInput,
      profileFields,
      passwordFields,
      isLoading,
    } = this.props

    const avatarProps = {
      ...avatar,
      src: user?.avatar ? `${RESOURCES_URL}${user?.avatar}` : avatar.src,
    }

    this.props.children = [
      new Loader({
        className: 'chat-layout__profile-loader',
        isVisible: isLoading,
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
            callback: this.onSubmitProfile.bind(this),
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
            callback: this.onSubmitPassword.bind(this),
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
    ]
  }
}

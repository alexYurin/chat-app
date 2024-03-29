import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Title, Form, Button, Loader } from 'components/index'
import { ChatUsersList } from 'layouts/Chat/components/index'
import { LoaderProps } from 'components/Loader'
import { InputProps } from 'components/Input'
import { UserType } from 'types/user'
import Validation from 'components/Form/Validation'
import { isFunction, isEquals } from 'utils/index'

import templateString from './template.pug'
import './styles.scss'

export type ChatFormUsersValuesType = {
  login: string
}

export interface ChatUsersFormProps extends BaseComponentProps {
  users?: UserType[]
  onCancel: () => void
  onSubmit: (values: ChatFormUsersValuesType) => void
  onRemoveUser?: (userId: number, chatId: number) => void
}

const formId = 'chat-users-form'

export default class ChatUsersForm extends BaseComponent<ChatUsersFormProps> {
  protected template = templateString
  protected disableRenderPropsList = ['users', 'isLoading', 'currentConatct']

  constructor(props: ChatUsersFormProps) {
    super('chatUsersForm', props)

    this.init()
  }

  protected onUpdateProps(
    propKey: keyof ChatUsersFormProps,
    prevValue: unknown,
    newValue: unknown
  ): boolean {
    switch (propKey) {
      case 'currentContact': {
        if (!isEquals(prevValue, newValue)) {
          this.init()

          return true
        }

        return false
      }

      case 'users': {
        if (!isEquals(prevValue, newValue)) {
          this.init()

          return true
        }

        return false
      }

      case 'isLoading': {
        const isVisible = newValue as boolean

        const loader = document.querySelector(
          '.chat-users__loader'
        ) as HTMLElement

        const loaderComponent = BaseComponent.findChild<Loader>(
          loader,
          this.props.children
        )

        loaderComponent?.setProps<LoaderProps>({
          isVisible,
        })
      }
    }

    return false
  }

  private onRemoveUser(userId: number) {
    if (isFunction(this.props.onRemoveUser)) {
      this.props.onRemoveUser(
        userId,
        this.props.currentContact?.detail.id as number
      )
    }
  }

  private validate(event: Event, currentInputProps: InputProps) {
    Form.validate(event, currentInputProps, this.props.children)
  }

  private onSubmit(event: Event) {
    const { isValidForm, values } =
      Form.preSubmitValidate<ChatFormUsersValuesType>(
        event,
        this.props.children
      )

    if (isValidForm && isFunction(this.props.onSubmit)) {
      this.props.onSubmit(values)
    }
  }

  protected init() {
    const { currentContact, users } = this.props

    this.props.children = [
      new Loader({
        className: 'chat-users__loader',
        isVisible: this.props.isLoading,
        withOverlay: true,
      }),
      new Title({
        level: 1,
        tagName: 'h2',
        className: 'chat-users__title',
        children: ['Управление чатом'],
      }),
      new ChatUsersList({
        currentContact,
        items: users || [],
        onRemoveItem: this.onRemoveUser.bind(this),
      }),
      new Form({
        id: formId,
        className: 'chat-users__form',
        fields: [
          {
            label: 'Добавить пользователя по логину',
            input: {
              name: 'login',
              type: 'text',
              validation: Validation.rules.login,
              listeners: [
                {
                  eventType: 'blur',
                  callback: (event: Event) =>
                    this.validate(event, {
                      name: 'login',
                      type: 'text',
                      validation: Validation.rules.login,
                    }),
                },
              ],
            },
          },
        ],
        listeners: [
          {
            eventType: 'submit',
            callback: this.onSubmit.bind(this),
          },
        ],
      }),
      new Button({
        form: formId,
        type: 'submit',
        status: 'primary',
        className: 'chat-users__button chat-create__button_submit',
        children: ['Добавить'],
      }),
      new Button({
        type: 'button',
        className: 'chat-users__button chat-create__button_cancel',
        children: ['Отмена'],
        listeners: [
          {
            eventType: 'click',
            callback: this.props.onCancel,
          },
        ],
      }),
    ]
  }
}

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Title, Form, Button, Loader } from 'components/index'
import { LoaderProps } from 'components/Loader'
import { InputProps } from 'components/Input'
import Validation from 'components/Form/Validation'
import { isFunction } from 'utils/index'

import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export type ChatFormUsersValuesType = {
  login: string
}

export interface ChatUsersFormProps extends BaseComponentProps {
  onCancel: () => void
  onSubmit: (values: ChatFormUsersValuesType) => void
}

const formId = 'chat-users-form'

export default class ChatUsersForm extends BaseComponent<ChatUsersFormProps> {
  protected template = templateString
  protected disableRenderPropsList = ['isLoading']

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

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Title, Form, Button, Loader } from 'components/index'
import { InputProps } from 'components/Input'
import Validation from 'components/Form/Validation'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

interface ChatCreateFormProps extends BaseComponentProps {
  isLoading?: boolean
  onValidate: (event: Event, currentInputProps: InputProps) => void
  onCancel: () => void
  onSubmit: (event: Event) => void
}

const formId = 'chat-create-form'

export default class ChatCreateForm extends BaseComponent<ChatCreateFormProps> {
  protected template = templateString

  constructor(props: ChatCreateFormProps) {
    super('chatCreate', props)

    this.init()
  }

  protected init() {
    this.props.children = [
      new Loader({
        className: 'chat-create__loader',
        isVisible: this.props.isLoading,
        withOverlay: true,
      }),
      new Title({
        level: 1,
        tagName: 'h2',
        className: 'chat-create__title',
        children: ['Создание нового чата'],
      }),
      new Form({
        id: formId,
        className: 'chat-create__form',
        fields: [
          {
            label: 'Логин пользователя',
            input: {
              name: 'login',
              type: 'text',
              validation: Validation.rules.login,
              listeners: [
                {
                  eventType: 'blur',
                  callback: (event: Event) =>
                    this.props.onValidate(event, {
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
            callback: this.props.onSubmit,
          },
        ],
      }),
      new Button({
        form: formId,
        type: 'submit',
        status: 'primary',
        className: 'chat-create__button chat-create__button_submit',
        children: ['Создать'],
      }),
      new Button({
        type: 'button',
        className: 'chat-create__button chat-create__button_cancel',
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

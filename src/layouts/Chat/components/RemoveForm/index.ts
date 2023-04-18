import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Title, Form, Button, Loader } from 'components/index'
import templateString from 'bundle-text:./template.pug'

import './styles.scss'

interface ChatRemoveFormProps extends BaseComponentProps {
  isLoading?: boolean
  onCancel: () => void
  onSubmit: (event: Event) => void
}

const formId = 'chat-remove-form'

export default class ChatCreateForm extends BaseComponent<ChatRemoveFormProps> {
  protected template = templateString

  constructor(props: ChatRemoveFormProps) {
    super('chatRemove', props)

    this.init()
  }

  protected init() {
    this.props.children = [
      new Loader({
        className: 'chat-remove__loader',
        isVisible: this.props.isLoading,
        withOverlay: true,
      }),
      new Title({
        level: 1,
        tagName: 'h2',
        className: 'chat-remove__title',
        children: ['Вы действительно хотите удалить чат?'],
      }),
      new Form({
        id: formId,
        className: 'chat-remove__form',
        fields: [],
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
        className: 'chat-remove__button chat-remove__button_submit',
        children: ['Удалить'],
      }),
      new Button({
        type: 'button',
        className: 'chat-remove__button chat-remove__button_cancel',
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

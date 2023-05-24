import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { Form, Button, Input } from 'components/index'
import { FormProps } from 'components/Form'
import { isFunction } from 'utils/index'

import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface ChatMessageInputProps extends BaseComponentProps {
  messageFields: FormProps['fields']
  onSendMessage?: (message: string) => void
}

const formMessageId = 'chat-message-form'

export default class ChatMessageInput extends BaseComponent<ChatMessageInputProps> {
  protected template = templateString

  constructor(props: ChatMessageInputProps) {
    super('chatMessageInput', props)

    this.init()
  }

  private onSendMessage(event: Event) {
    event.preventDefault()

    const { isValidForm, values } = Form.preSubmitValidate(
      event,
      this.props.children
    )

    if (isValidForm && isFunction(this.props.onSendMessage)) {
      const chatInput = (event.target as Element).querySelector(
        '.input'
      ) as HTMLElement

      const chatInputInstance = BaseComponent.findChild<Input>(
        chatInput,
        this.props.children
      )

      chatInputInstance?.setProps({
        value: '',
      })

      this.props.onSendMessage(values.message)
    }
  }

  protected init() {
    const { messageFields } = this.props

    this.props.children = [
      new Form({
        id: formMessageId,
        className: 'chat-layout__message-form chat-layout__form',
        fields: messageFields.map(({ label, input }) => {
          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: this.onSendMessage.bind(this),
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

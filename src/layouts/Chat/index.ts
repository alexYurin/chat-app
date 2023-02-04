import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Form, Button, Link } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { LinkProps } from 'components/Link'
import './styles.scss'

export interface ChatDataType {
  fields: FormProps['fields']
  submitButtonText: string
  authLink: LinkProps
}

export type ChatForm = Form
export type ChatSubmitButton = Button
export type BackLink = Link

export type ChatChildrenPropsType = [ChatForm, ChatSubmitButton, BackLink]

const formId = 'chat-form'

export default class ChatLayout extends BaseLayout<
  ChatChildrenPropsType,
  ChatDataType
> {
  protected template = layout

  init() {
    const { fields, submitButtonText } = this.data

    const validate = (event: Event, currentInputProps: InputProps) => {
      Form.validate(event, currentInputProps, this.props.children)
    }

    const onSubmit = (event: Event) => {
      Form.onSubmit(event, this.props.children)
    }

    this.props.children = [
      new Form({
        id: formId,
        className: 'chat-layout__form',
        fields: fields.map(({ label, input }) => {
          input.listeners = [
            {
              eventType: 'focus',
              callback: (event: Event) => validate(event, input),
            },
            {
              eventType: 'blur',
              callback: (event: Event) => validate(event, input),
            },
          ]

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: onSubmit,
          },
        ],
      }),
      new Button({
        status: 'primary',
        type: 'submit',
        form: formId,
        children: [submitButtonText],
      }),
      new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    ]
  }
}

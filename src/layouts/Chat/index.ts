import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Form, Button } from 'components/index'
import { InputProps } from 'components/Input'
import { connect } from 'services/Store'
import { ChatPropsType } from './types'

import './styles.scss'

const formId = 'chat-form'

class ChatLayout extends BaseLayout<ChatPropsType> {
  protected template = layout

  init() {
    const { fields, submitButtonText } = this.props

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
    ]
  }
}

const withUser = connect((state) => ({ user: state.user }))

export default withUser<ChatPropsType>(ChatLayout)

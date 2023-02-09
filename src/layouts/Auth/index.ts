import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import routes from 'router/routes'
import { HistoryPusher } from 'services/index'
import { Title, Form, Button, Link } from 'components/index'
import { InputProps } from 'components/Input'
import { AuthPropsType } from './types'

import './styles.scss'

const formId = 'auth-form'

export default class AuthLayout extends BaseLayout<AuthPropsType> {
  protected template = layout

  init() {
    const { title, authLink, fields, submitButtonText } = this.props

    const validate = (event: Event, currentInputProps: InputProps) => {
      Form.validate(event, currentInputProps, this.props.children)
    }

    const onSubmit = (event: Event) => {
      const isValidForm = Form.onSubmit(event, this.props.children)

      if (isValidForm) {
        const isRedirect = confirm('Форма успешно отправлена. Перейти в чат?')

        if (isRedirect) {
          return HistoryPusher.pushTo(routes.chat.pathname)
        }
      }
    }

    this.props.children = [
      new Title({
        className: 'auth-layout__title',
        level: 1,
        children: [title],
      }),
      new Form({
        id: formId,
        className: 'auth-layout__form scroll',
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
      new Link(authLink),
      new Link({
        href: '/',
        isRoute: true,
        children: ['К списку страниц'],
      }),
    ]
  }
}

import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import routes from 'router/routes'
import { HistoryPusher } from 'services/index'
import { Title, Form, Button, Link } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { LinkProps } from 'components/Link'
import './styles.scss'

export interface AuthDataType {
  title: string
  fields: FormProps['fields']
  submitButtonText: string
  authLink: LinkProps
}

export type AuthTitle = Title
export type AuthForm = Form
export type AutSwitchFormhLink = Link
export type AuthSubmitButton = Button
export type BackLink = Link

export type AuthChildrenPropsType = [
  AuthTitle,
  AuthForm,
  AuthSubmitButton,
  AutSwitchFormhLink,
  BackLink
]

const formId = 'auth-form'

export default class AuthLayout extends BaseLayout<
  AuthChildrenPropsType,
  AuthDataType
> {
  protected template = layout

  init() {
    const { title, authLink, fields, submitButtonText } = this.data

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
        children: ['К списку страниц'],
      }),
    ]
  }
}

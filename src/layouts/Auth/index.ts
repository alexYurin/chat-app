import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import validation, { RulesType } from 'components/Form/validation'
import { Title, Form, Input, Link } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { LinkProps } from 'components/Link'
import './styles.scss'

export interface AutDataType {
  title: string
  fields: FormProps['fields']
  authLink: LinkProps
}

export type AuthChildrenPropsType = [Title, Form, Link, Link]

export default class AuthLayout extends BaseLayout<
  AuthChildrenPropsType,
  AutDataType
> {
  protected template = layout

  init() {
    const { title, authLink, fields } = this.data

    function validate(this: Input, event: Event) {
      console.log(event.type)

      const input = event.target as HTMLInputElement

      const check = validation(input.name as keyof RulesType, input.value)

      const props = check.isValid
        ? { message: undefined, statis: 'default' }
        : { status: 'alert', message: check.errorText }

      this.setProps(props as InputProps)
    }

    this.props.children = [
      new Title({
        className: 'auth-layout__title',
        level: 1,
        children: [title],
      }),
      new Form({
        className: 'auth-layout__form',
        fields: fields.map(({ label, input }) => {
          input.listeners = [
            {
              eventType: 'focus',
              callback(event: Event) {
                validate.bind(this as unknown as Input, event)
              },
            },
            {
              eventType: 'blur',
              callback(event: Event) {
                validate.bind(this as unknown as Input, event)
              },
            },
          ]

          return {
            label,
            input,
          }
        }),
      }),
      new Link(authLink),
      new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    ]
  }
}

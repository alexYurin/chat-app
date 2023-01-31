import layout from 'bundle-text:./layout.pug'
import BaseLayout, { BaseLayoutPropsType } from 'layouts/Base/index'
import { Title, Form, Link } from 'components/index'
import { FormProps } from 'components/Form'
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

  protected onMount() {
    console.log('AUTH MOUNT')
  }

  protected onUpdateProps(
    propKey: keyof BaseLayoutPropsType<AuthChildrenPropsType, AutDataType>,
    prevProp: unknown,
    newProp: unknown
  ) {
    console.log('AUTH UPDATE', propKey, prevProp, newProp)
  }

  init() {
    const { title, authLink, fields } = this.data

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
              eventType: 'input',
              callback(event: Event) {
                const target = event.target as HTMLInputElement

                if (target.name === 'login') {
                  this.setProps({
                    value: target.value,
                  })
                }
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

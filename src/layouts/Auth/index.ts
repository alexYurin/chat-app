import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
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
    const inputLogin = BaseLayout.findChild('input-login', this.props.children)
    console.log('inputLogin', inputLogin)
  }

  init() {
    const { title, authLink, fields } = this.data

    this.props.children = [
      new Title({
        instanceName: 'auth-title',
        className: 'auth-layout__title',
        level: 1,
        children: [title],
      }),
      new Form({
        instanceName: 'auth-form',
        className: 'auth-layout__form',
        fields,
      }),
      new Link(authLink),
      new Link({
        instanceName: 'back-link',
        href: '/',
        children: ['К списку страниц'],
      }),
    ]
  }
}

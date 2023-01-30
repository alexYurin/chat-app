import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Title, Form, Link } from 'components/index'
import { FieldType, ButtonsFieldType } from 'components/Form'
import { LinkProps } from 'components/Link'
import './styles.scss'

export interface AutDataType {
  title: string
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
  authLink: LinkProps
}

export type AuthChildrenPropsType = [Title, Form, Link, Link]

export default class AuthLayout extends BaseLayout<
  AuthChildrenPropsType,
  AutDataType
> {
  protected template = layout

  init() {
    const { title, authLink, fields, actionButtons } = this.data

    this.props.children = [
      new Title({
        className: 'auth-layout__title',
        level: 1,
        children: [title],
      }),
      new Form({
        className: 'auth-layout__form',
        fields,
        actionButtons,
      }),
      new Link(authLink),
      new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    ]
  }
}
import { Title, Form, Link } from 'components/index'
import { FieldType, ButtonsFieldType } from 'components/Form'
import { BaseLayoutProps } from 'layouts/BaseLayout'
import { LinkProps } from 'components/Link'
import BaseModel from 'layouts/BaseModel'

export interface AuthModelType {
  title: Title
  authLink: Link
  form: Form
  backLink: Link
}
export interface AuthModelProps extends BaseLayoutProps {
  title: string
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
  authLink: LinkProps
}

export default class AuthModel extends BaseModel<
  AuthModelProps,
  AuthModelType
> {
  constructor(props: AuthModelProps) {
    super(props)

    this.configurate()
  }

  configurate() {
    const { title, authLink, fields, actionButtons } = this.props

    this.model = {
      title: new Title({
        className: 'auth-layout__title',
        level: 1,
        children: [title],
      }),
      form: new Form({
        className: 'auth-layout__form',
        fields,
        actionButtons,
      }),
      authLink: new Link(authLink),
      backLink: new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    }
  }
}

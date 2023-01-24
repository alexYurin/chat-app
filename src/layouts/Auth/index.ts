import layout from 'bundle-text:./layout.pug'
import BaseLayout, {
  BaseLayoutProps,
  BaseLayoutParamsType,
} from 'layouts/Base/index'
import { Title, Form, Link } from 'components/index'
import { FieldType, ButtonsFieldType } from 'components/Form'
import { LinkProps } from 'components/Link'
import './styles.scss'

export interface AuthLayoutProps extends BaseLayoutProps {
  title: string
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
  authLink: LinkProps
}

export type AuthLayoutMapType = {
  title: Title
  authLink: Link
  form: Form
  backLink: Link
}

export default class AuthLayout extends BaseLayout<
  AuthLayoutProps,
  AuthLayoutMapType
> {
  protected template = layout

  constructor(params: BaseLayoutParamsType<AuthLayoutProps>) {
    super(params)
  }

  init() {
    const { title, authLink, fields, actionButtons } = this.getProps()

    this.map = {
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

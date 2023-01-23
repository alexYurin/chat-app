import layout from 'bundle-text:./layout.pug'
import AuthModel, { AuthModelProps, AuthModelType } from './model'
import BaseLayout from 'layouts/BaseLayout'
import './styles.scss'

export default class AuthLayout extends BaseLayout<
  AuthModelProps,
  AuthModelType
> {
  public layout = layout

  constructor(props: AuthModelProps) {
    super(new AuthModel(props))

    this.pathname = props.pathname
    this.pageTitle = props.pageTitle
  }
}

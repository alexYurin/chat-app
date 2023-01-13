import layout from 'bundle-text:./layout.pug'
import modelConstructor, {
  AuthModelType,
  AuthModelConstructorType,
} from './model'
import BaseLayout, { BaseLayoutProps } from 'layouts/BaseLayout'
import './styles.scss'

export type AuthLayoutProps = BaseLayoutProps

export default class AuthLayout extends BaseLayout<
  AuthLayoutProps,
  AuthModelType,
  AuthModelConstructorType
> {
  public layout = layout
  public modelConstructor = modelConstructor
}

import layout from 'bundle-text:./layout.pug'
import modelConstructor, {
  ProfileModelType,
  ProfileModelConstructorType,
} from './model'
import BaseLayout, { BaseLayoutProps } from 'layouts/BaseLayout'
import './styles.scss'

export type ProfileLayoutProps = BaseLayoutProps

export default class ProfileLayout extends BaseLayout<
  ProfileLayoutProps,
  ProfileModelType,
  ProfileModelConstructorType
> {
  public layout = layout
  public modelConstructor = modelConstructor
}

import layout from 'bundle-text:./layout.pug'
import modelConstructor, {
  ProfileModelType,
  ProfileModelConstructorType,
} from './model'
import BaseLayout, { BaseLayoutProps } from 'layouts/BaseLayout'

export type ProfileEditPasswordLayoutProps = BaseLayoutProps

export default class ProfileLayout extends BaseLayout<
  ProfileEditPasswordLayoutProps,
  ProfileModelType,
  ProfileModelConstructorType
> {
  public layout = layout
  public modelConstructor = modelConstructor
}

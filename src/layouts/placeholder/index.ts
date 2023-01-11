import layout from 'bundle-text:./layout.pug'
import modelConstructor, {
  PlaceholderModelType,
  PlaceholderModelConstructorType,
} from './model'
import BaseLayout, { BaseLayoutProps } from 'layouts/BaseLayout'
import './styles.scss'

export type PlaceholderLayoutProps = BaseLayoutProps

export default class PlaceholderLayout extends BaseLayout<
  PlaceholderLayoutProps,
  PlaceholderModelType,
  PlaceholderModelConstructorType
> {
  public layout = layout
  public modelConstructor = modelConstructor
}

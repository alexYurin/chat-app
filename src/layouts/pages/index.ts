import layout from 'bundle-text:./layout.pug'
import modelConstructor, {
  PagesModelType,
  PagesModelConstructorType,
} from './model'
import BaseLayout, { BaseLayoutProps } from 'layouts/BaseLayout'
import './styles.scss'

export type PagesLayoutProps = BaseLayoutProps

export default class PlaceholderLayout extends BaseLayout<
  PagesLayoutProps,
  PagesModelType,
  PagesModelConstructorType
> {
  public layout = layout
  public modelConstructor = modelConstructor
}

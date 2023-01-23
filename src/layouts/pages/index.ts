import layout from 'bundle-text:./layout.pug'
import PagesModel, { PagesModelType, PagesModelProps } from './model'
import BaseLayout from 'layouts/BaseLayout'
import './styles.scss'

export default class PagesLayout extends BaseLayout<
  PagesModelProps,
  PagesModelType
> {
  public layout = layout

  constructor(props: PagesModelProps) {
    super(new PagesModel(props))

    this.pathname = props.pathname
    this.pageTitle = props.pageTitle
  }
}

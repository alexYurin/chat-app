import layout from 'bundle-text:./layout.pug'
import BaseLayout, {
  BaseLayoutProps,
  BaseLayoutParamsType,
} from 'layouts/Base/index'
import { Title, Link } from 'components/index'
import './styles.scss'

export interface PlaceholderLayoutProps extends BaseLayoutProps {
  title: string
  description: string
}

export interface PlaceholderLayoutMapType {
  title: Title
  description: string
  backLink: Link
}

export default class PlaceholderLayout extends BaseLayout<
  PlaceholderLayoutProps,
  PlaceholderLayoutMapType
> {
  protected template = layout

  constructor(params: BaseLayoutParamsType<PlaceholderLayoutProps>) {
    super(params)
  }

  init() {
    const { title, description } = this.getProps()

    this.map = {
      title: new Title({
        level: 1,
        children: [title],
      }),
      description,
      backLink: new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    }
  }
}

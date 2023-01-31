import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Title, Link } from 'components/index'
import './styles.scss'

export type PlaceholderDataType = {
  title: string
  description: string
}

export type PlaceholderChildrenPropsType = [Title, string, Link]

export default class PlaceholderLayout extends BaseLayout<
  PlaceholderChildrenPropsType,
  PlaceholderDataType
> {
  protected template = layout

  init() {
    const { title, description } = this.data

    this.props.children = [
      new Title({
        instanceName: 'placeholder-title',
        level: 1,
        children: [title],
      }),
      description,
      new Link({
        instanceName: 'back-link',
        href: '/',
        children: ['К списку страниц'],
      }),
    ]
  }
}

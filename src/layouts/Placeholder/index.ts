import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Title, Link } from 'components/index'
import { PlaceholderPropsType } from './types'

import './styles.scss'

export default class PlaceholderLayout extends BaseLayout<PlaceholderPropsType> {
  protected template = layout

  init() {
    const { title, description } = this.props

    this.props.children = [
      new Title({
        level: 1,
        children: [title],
      }),
      description,
      new Link({
        href: '/',
        isRoute: true,
        children: ['К списку страниц'],
      }),
    ]
  }
}

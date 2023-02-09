import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Title, Link } from 'components/index'
import routes from 'router/routes'
import { PagesPropsType } from './types'

import './styles.scss'

const isNotRootLocation = (pathname: string) => pathname !== '/'

export default class PagesLayout extends BaseLayout<PagesPropsType> {
  protected template = layout

  init() {
    const { title } = this.props

    this.props.children = [
      new Title({
        level: 1,
        children: [title],
      }),
      ...Object.values(routes).reduce((currentRoutes, route) => {
        if (isNotRootLocation(route.pathname)) {
          return [
            ...currentRoutes,
            new Link({
              className: 'pages__link',
              href: route.pathname,
              isRoute: true,
              children: [route.title],
            }),
          ]
        }

        return currentRoutes
      }, [] as Link[]),
    ]
  }
}

import layout from 'bundle-text:./layout.pug'
import BaseLayout, {
  BaseLayoutProps,
  BaseLayoutParamsType,
} from 'layouts/Base/index'
import { Title, Link } from 'components/index'
import routes from 'router/routes'
import './styles.scss'

export interface PagesLayoutProps extends BaseLayoutProps {
  title: string
}

export type PagesLayoutMapType = {
  title: Title
  children: Link[]
}

const isNotRootLocation = (pathname: string) => pathname !== '/'

export default class PagesLayout extends BaseLayout<
  PagesLayoutProps,
  PagesLayoutMapType
> {
  protected template = layout

  constructor(params: BaseLayoutParamsType<PagesLayoutProps>) {
    super(params)
  }

  init() {
    const { title } = this.getProps()

    this.map = {
      title: new Title({
        level: 1,
        children: [title],
      }),
      children: Object.values(routes).reduce((currentRoutes, route) => {
        if (isNotRootLocation(route.pathname)) {
          return [
            ...currentRoutes,
            new Link({
              className: 'pages__link',
              href: route.pathname,
              children: [route.title],
            }),
          ]
        }

        return currentRoutes
      }, [] as Link[]),
    }
  }
}

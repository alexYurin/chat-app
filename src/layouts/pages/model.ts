import { Title, Link } from 'components/index'
import { BaseLayoutProps } from 'layouts/BaseLayout'
import { RoutesTypes } from 'router/routes'
import BaseModel from 'layouts/BaseModel'

export interface PagesModelType {
  title: Title
  links: Link[]
}

export interface PagesModelProps extends BaseLayoutProps {
  routes: RoutesTypes
}

const isNotRootLocation = (pathname: string) => pathname !== '/'

export default class PagesModel extends BaseModel<
  PagesModelProps,
  PagesModelType
> {
  constructor(props: PagesModelProps) {
    super(props)

    this.configurate()
  }

  configurate() {
    const { routes, pageTitle } = this.props

    this.model = {
      title: new Title({
        level: 1,
        children: [pageTitle],
      }),
      links: Object.values(routes).reduce((currentRoutes, route) => {
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

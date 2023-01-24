import { Title, Link } from 'components/index'
import { BaseControllerProps } from 'core/BaseController'
import { RoutesTypes } from 'router/routes'
import BaseModel from 'core/BaseModel'

export interface PagesModelType {
  title: Title
  links: Link[]
}

export interface PagesModelProps extends BaseControllerProps {
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
    const { routes, screenTitle } = this.props

    this.model = {
      title: new Title({
        level: 1,
        children: [screenTitle],
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

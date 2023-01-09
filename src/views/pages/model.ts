import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'
import { RoutesTypes } from 'router/routes'

export interface PagesModelType extends BaseModelType {
  routes: RoutesTypes
}

const isNotRootLocation = (pathname: string) => pathname !== '/'

const createModel = ({ routes, title }: PagesModelType) => ({
  title,
  links: Object.values(routes).reduce((currentRoutes, route) => {
    if (isNotRootLocation(route.pathname)) {
      return [
        ...currentRoutes,
        new Link().create({
          className: 'pages__link',
          href: route.pathname,
          slot: route.title,
        }),
      ]
    }

    return currentRoutes
  }, [] as string[]),
})

export default createModel

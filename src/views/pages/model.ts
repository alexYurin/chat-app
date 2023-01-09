import { Link } from 'components/index'
import routes from 'router/routes'

const { pathname, title } = routes.pages

const isNotRootLocation = (pathname: string) => pathname !== '/'

const model = {
  pathname,
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
}

export default model

import { ViewController } from 'controllers/index'
import { Link } from 'components/index'
import view from 'views/pages'
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
        Link.create({
          className: 'pages__link',
          href: route.pathname,
          slot: route.title,
        }),
      ]
    }

    return currentRoutes
  }, [] as string[]),
}

new ViewController(view, model)

import { Title, Link } from 'components/index'
import { BaseModelType } from 'layouts/LayoutModel'
import { RoutesTypes } from 'router/routes'

export interface PagesModelType extends BaseModelType {
  routes: RoutesTypes
}

const isNotRootLocation = (pathname: string) => pathname !== '/'

const modelConstructor = ({ routes, title }: PagesModelType) => ({
  title: new Title().create({
    level: 1,
    children: [title],
  }),
  links: Object.values(routes).reduce((currentRoutes, route) => {
    if (isNotRootLocation(route.pathname)) {
      return [
        ...currentRoutes,
        new Link().create({
          className: 'pages__link',
          href: route.pathname,
          children: [route.title],
        }),
      ]
    }

    return currentRoutes
  }, [] as string[]),
})

export type PagesModelConstructorType = ReturnType<typeof modelConstructor>

export default modelConstructor

import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.notFound

export default new PlaceholderLayout({
  pathname,
  title,
  description: 'Не туда попали',
  linkUrl: '/',
  linkText: 'К списку страниц',
})

import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.notFound

export default new PlaceholderLayout({
  pathname,
  pageTitle: title,
}).create({
  title,
  description: 'Не туда попали',
})

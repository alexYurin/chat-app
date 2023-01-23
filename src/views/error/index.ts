import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.error

export default new PlaceholderLayout({
  pathname,
  pageTitle: title,
  title,
  description: 'Мы уже фиксим',
})

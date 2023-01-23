import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.chat

export default new PlaceholderLayout({
  pathname,
  pageTitle: title,
  title,
  description: 'Будет реализован в следующих спринтах 😜',
})

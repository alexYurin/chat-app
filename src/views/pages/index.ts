import routes from 'router/routes'
import { PagesLayout } from 'layouts/index'

const { pathname, title } = routes.pages

export default new PagesLayout({ pathname, pageTitle: title }).createModel({
  title,
  routes,
})

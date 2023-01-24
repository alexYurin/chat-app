import routes from 'router/routes'
import { PagesLayout } from 'layouts/index'

const { pathname, title } = routes.pages

const props = {
  pathname,
  screenTitle: title,
  routes,
}

export default new PagesLayout('pages', props)

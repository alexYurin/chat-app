import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.notFound

const props = {
  pathname,
  screenTitle: title,
  title,
  description: 'Не туда попали',
}

export default new PlaceholderLayout('notFound', props)

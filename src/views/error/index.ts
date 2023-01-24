import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.error

const props = {
  pathname,
  screenTitle: title,
  title,
  description: 'Мы уже фиксим',
}

export default new PlaceholderLayout('error', props)

import routes from 'router/routes'
import { PlaceholderLayout } from 'layouts/index'

const { pathname, title } = routes.chat

const props = {
  pathname,
  screenTitle: title,
  title,
  description: 'Будет реализован в следующих спринтах 😜',
}

export default new PlaceholderLayout('chat', props)

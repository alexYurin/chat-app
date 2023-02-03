import routes from 'router/routes'
import PlaceholderLayout from 'layouts/Placeholder/index'

const { name, pathname, title } = routes.notFound

export default {
  Layout: PlaceholderLayout,
  props: {
    name,
    pathname,
    documentTitle: title,
    data: {
      title,
      description: 'Не туда попали',
    },
  },
}

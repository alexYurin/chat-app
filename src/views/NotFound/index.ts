import routes from 'router/routes'
import PlaceholderLayout from 'layouts/Placeholder/index'

const { name, pathname, title } = routes.notFound

export default new PlaceholderLayout({
  name,
  props: {
    pathname,
    documentTitle: title,
    data: {
      title,
      description: 'Не туда попали',
    },
  },
})

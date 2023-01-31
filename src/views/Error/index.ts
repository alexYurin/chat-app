import routes from 'router/routes'
import PlaceholderLayout from 'layouts/Placeholder/index'

const { name, pathname, title } = routes.error

export default new PlaceholderLayout({
  name,
  props: {
    pathname,
    instanceName: name,
    documentTitle: title,
    data: {
      title,
      description: 'Мы уже фиксим',
    },
  },
})

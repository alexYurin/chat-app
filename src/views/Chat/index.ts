import routes from 'router/routes'
import PlaceholderLayout from 'layouts/Placeholder/index'

const { name, pathname, title } = routes.chat

export default new PlaceholderLayout({
  name,
  props: {
    pathname,
    documentTitle: title,
    data: {
      title,
      description: 'Будет реализован в следующих спринтах 😜',
    },
  },
})

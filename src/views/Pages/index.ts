import routes from 'router/routes'
import PagesLayout from 'layouts/Pages/index'

const { name, pathname, title } = routes.pages

export default new PagesLayout({
  name,
  props: {
    documentTitle: title,
    pathname,
    data: { title },
  },
})

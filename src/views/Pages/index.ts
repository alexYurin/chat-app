import routes from 'router/routes'
import PagesLayout from 'layouts/Pages/index'

const { name, pathname, title } = routes.pages

export default {
  Layout: PagesLayout,
  props: {
    name,
    documentTitle: title,
    pathname,
    data: { title },
  },
}

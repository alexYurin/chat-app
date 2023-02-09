import routes from 'router/routes'
import PagesLayout from 'layouts/Pages/index'

const { name, pathname, title } = routes.pages

const createView = () => {
  return new PagesLayout(name, {
    title,
  })
}

export type ViewPagesType = ReturnType<typeof createView>

export default {
  title,
  pathname,
  createView,
}

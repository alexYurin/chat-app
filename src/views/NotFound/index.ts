import routes from 'router/routes'
import PlaceholderLayout from 'layouts/Placeholder/index'

const { name, pathname, title } = routes.notFound

const createView = () => {
  return new PlaceholderLayout(name, {
    title,
    description: 'Не туда попали',
  })
}

export type ViewNotFoundType = ReturnType<typeof createView>

export default {
  pathname,
  title,
  createView,
}

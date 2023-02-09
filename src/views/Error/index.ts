import routes from 'router/routes'
import PlaceholderLayout from 'layouts/Placeholder/index'

const { name, pathname, title } = routes.error

const createView = () => {
  return new PlaceholderLayout(name, {
    title,
    description: 'Мы уже фиксим',
  })
}

export type ViewErrorType = ReturnType<typeof createView>

export default {
  title,
  pathname,
  createView,
}

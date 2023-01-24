import routes from 'router/routes'
import { BaseLayoutParamsType } from 'layouts/Base'
import PlaceholderLayout, {
  PlaceholderLayoutProps,
} from 'layouts/Placeholder/index'

const { pathname, title } = routes.error

const params: BaseLayoutParamsType<PlaceholderLayoutProps> = {
  name: 'error',
  props: {
    pathname,
    documentTitle: title,
    title,
    description: 'Мы уже фиксим',
  },
}

export default new PlaceholderLayout(params)

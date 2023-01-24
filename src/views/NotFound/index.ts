import routes from 'router/routes'
import { BaseLayoutParamsType } from 'layouts/Base'
import PlaceholderLayout, {
  PlaceholderLayoutProps,
} from 'layouts/Placeholder/index'

const { pathname, title } = routes.notFound

const params: BaseLayoutParamsType<PlaceholderLayoutProps> = {
  name: 'notFound',
  props: {
    pathname,
    documentTitle: title,
    title,
    description: 'Не туда попали',
  },
}

export default new PlaceholderLayout(params)

import routes from 'router/routes'
import { BaseLayoutParamsType } from 'layouts/Base'
import PlaceholderLayout, {
  PlaceholderLayoutProps,
} from 'layouts/Placeholder/index'

const { pathname, title } = routes.chat

const params: BaseLayoutParamsType<PlaceholderLayoutProps> = {
  name: 'chat',
  props: {
    pathname,
    documentTitle: title,
    title,
    description: 'Будет реализован в следующих спринтах 😜',
  },
}

export default new PlaceholderLayout(params)

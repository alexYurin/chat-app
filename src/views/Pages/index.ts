import routes from 'router/routes'
import { BaseLayoutParamsType } from 'layouts/Base'
import PagesLayout, { PagesLayoutProps } from 'layouts/Pages/index'

const { pathname, title } = routes.pages

const params: BaseLayoutParamsType<PagesLayoutProps> = {
  name: 'pages',
  props: {
    documentTitle: title,
    title,
    pathname,
  },
}

export default new PagesLayout(params)

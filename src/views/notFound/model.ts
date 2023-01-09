import { Link } from 'components/index'
import routes from 'router/routes'

const { pathname, title } = routes.notFound

const model = {
  pathname,
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
}

export default model

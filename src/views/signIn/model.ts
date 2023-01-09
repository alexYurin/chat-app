import { Link } from 'components/index'
import routes from 'router/routes'

const { pathname, title } = routes.signIn

const model = {
  pathname,
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
}

export default model

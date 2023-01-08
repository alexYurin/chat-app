import { ViewController } from 'controllers/index'
import { Link } from 'components/index'
import view from 'views/signIn'
import routes from 'router/routes'

const { pathname, title } = routes.signIn

const model = {
  pathname,
  title,
  backLink: Link.create({
    href: '/',
    slot: 'Back',
  }),
}

new ViewController(view, model)

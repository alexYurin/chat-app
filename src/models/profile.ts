import { ViewController } from 'controllers/index'
import { Link } from 'components/index'
import view from 'views/profile'
import routes from 'router/routes'

const { pathname, title } = routes.profile

const model = {
  pathname,
  title,
  backLink: Link.create({
    href: '/',
    slot: 'Back',
  }),
}

new ViewController(view, model)

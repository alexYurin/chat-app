import { ViewController } from 'controllers/index'
import { Link } from 'components/index'
import view from 'views/error'
import routes from 'router/routes'

const { pathname, title } = routes.error

const model = {
  pathname,
  title,
  backLink: Link.create({
    href: '/',
    slot: 'Back',
  }),
}

new ViewController(view, model)

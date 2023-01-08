import { ViewController } from 'controllers/index'
import { Link } from 'components/index'
import view from 'views/chat'
import routes from 'router/routes'

const { pathname, title } = routes.chat

const model = {
  pathname,
  title,
  backLink: Link.create({
    href: '/',
    slot: 'Back',
  }),
}

new ViewController(view, model)

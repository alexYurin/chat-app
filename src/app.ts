import 'styles/index.scss'
import 'components'
import { Router, routes } from 'router/index'

Object.values(routes).forEach((route) => {
  Router.use(route.title, route.pathname, route.View)
})

Router.run()

import 'styles/index.scss'
import 'components'
import { Router } from 'router/index'
import { ViewType } from 'router/Route'
import {
  ChatView,
  SignInView,
  SignUpView,
  ErrorView,
  NotFoundView,
} from './views'

const views = [ChatView, SignInView, SignUpView, ErrorView, NotFoundView]

views.forEach((view) => {
  Router.use(view as ViewType)
})

Router.run()

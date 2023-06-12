import 'styles'
import 'components'
import { Router } from 'router/index'
import {
  ChatView,
  SignInView,
  SignUpView,
  ErrorView,
  NotFoundView,
} from './views'

Router.use(ChatView)
  .use(SignInView)
  .use(SignInView)
  .use(SignUpView)
  .use(ErrorView)
  .use(NotFoundView)
  .run()

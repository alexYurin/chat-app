import * as Views from 'views/index'

const routes = {
  signIn: {
    pathname: Views.SignInView.pathname,
    View: Views.SignInView,
  },
  signUp: {
    pathname: Views.SignUpView.pathname,
    View: Views.SignUpView,
  },
  chat: {
    pathname: Views.ChatView.pathname,
    View: Views.ChatView,
  },
  notFound: {
    pathname: Views.NotFoundView.pathname,
    View: Views.NotFoundView,
  },
  error: {
    pathname: Views.ErrorView.pathname,
    View: Views.ErrorView,
  },
} as const

export type RoutesTypes = typeof routes

export default routes

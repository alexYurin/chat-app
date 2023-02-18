import * as Views from 'views/index'

const routes = {
  signIn: {
    isPrivate: false,
    pathname: Views.SignInView.pathname,
    View: Views.SignInView,
  },
  signUp: {
    isPrivate: false,
    pathname: Views.SignUpView.pathname,
    View: Views.SignUpView,
  },
  chat: {
    isPrivate: true,
    pathname: Views.ChatView.pathname,
    View: Views.ChatView,
  },
  profile: {
    isPrivate: true,
    pathname: Views.ProfileView.pathname,
    View: Views.ProfileView,
  },
  profileEditPassword: {
    isPrivate: true,
    pathname: Views.ProfileEditPasswordView.pathname,
    View: Views.ProfileEditPasswordView,
  },
  notFound: {
    isPrivate: false,
    pathname: Views.NotFoundView.pathname,
    View: Views.NotFoundView,
  },
  error: {
    isPrivate: false,
    pathname: Views.ErrorView.pathname,
    View: Views.ErrorView,
  },
} as const

export type RoutesTypes = typeof routes

export default routes

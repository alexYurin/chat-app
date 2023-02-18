import * as Views from 'views/index'

const routes = {
  signIn: {
    name: 'signIn',
    title: 'Вход',
    isPrivate: false,
    pathname: Views.SignInView.pathname,
    View: Views.SignInView,
  },
  signUp: {
    name: 'signUp',
    title: 'Регистрация',
    isPrivate: false,
    pathname: Views.SignUpView.pathname,
    View: Views.SignUpView,
  },
  chat: {
    name: 'chat',
    title: 'Чат',
    isPrivate: true,
    pathname: Views.ChatView.pathname,
    View: Views.ChatView,
  },
  profile: {
    name: 'profile',
    title: 'Профиль (Настройки)',
    isPrivate: true,
    pathname: Views.ProfileView.pathname,
    View: Views.ProfileView,
  },
  profileEditPassword: {
    name: 'profileEditPassword',
    title: 'Профиль (Смена пароля)',
    isPrivate: true,
    pathname: Views.ProfileEditPasswordView.pathname,
    View: Views.ProfileEditPasswordView,
  },
  notFound: {
    name: 'notFound',
    title: '404',
    isPrivate: false,
    pathname: Views.NotFoundView.pathname,
    View: Views.NotFoundView,
  },
  error: {
    name: 'error',
    title: '500',
    isPrivate: false,
    pathname: Views.ErrorView.pathname,
    View: Views.ErrorView,
  },
} as const

export type RoutesTypes = typeof routes

export default routes

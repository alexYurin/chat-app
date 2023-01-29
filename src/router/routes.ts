const routes = {
  pages: {
    name: 'page',
    title: 'Страницы',
    pathname: '/',
  },
  signIn: {
    name: 'signIn',
    title: 'Вход',
    pathname: '/sign-in',
  },
  signUp: {
    name: 'signUp',
    title: 'Регистрация',
    pathname: '/sign-up',
  },
  chat: {
    name: 'chat',
    title: 'Чат',
    pathname: '/chat',
  },
  profile: {
    name: 'profile',
    title: 'Профиль (Настройки)',
    pathname: '/profile',
  },
  profileEditPassword: {
    name: 'profileEditPassword',
    title: 'Профиль (Смена пароля)',
    pathname: '/profile-edit-password',
  },
  notFound: {
    name: 'notFound',
    title: '404',
    pathname: '/not-found',
  },
  error: {
    name: 'error',
    title: '500',
    pathname: '/error',
  },
}

export type RoutesTypes = typeof routes

export default routes

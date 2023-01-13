const routes = {
  pages: {
    title: 'Страницы',
    pathname: '/',
  },
  signIn: {
    title: 'Вход',
    pathname: '/sign-in',
  },
  signUp: {
    title: 'Регистрация',
    pathname: '/sign-up',
  },
  chat: {
    title: 'Чат',
    pathname: '/chat',
  },
  profile: {
    title: 'Профиль (Настройки)',
    pathname: '/profile',
  },
  profileEditPassword: {
    title: 'Профиль (Смена пароля)',
    pathname: '/profile-edit-password',
  },
  notFound: {
    title: '404',
    pathname: '/not-found',
  },
  error: {
    title: '500',
    pathname: '/error',
  },
}

export type RoutesTypes = typeof routes

export default routes

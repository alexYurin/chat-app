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
    title: 'Профиль',
    pathname: '/profile',
  },
  notFound: {
    title: '404',
    pathname: '/404',
  },
  error: {
    title: '500',
    pathname: '/error',
  },
}

export type RoutesTypes = typeof routes

export default routes

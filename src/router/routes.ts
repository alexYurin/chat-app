const routes = {
  pages: {
    title: 'Pages',
    pathname: '/',
  },
  signIn: {
    title: 'Sign In',
    pathname: '/sign-in',
  },
  signUp: {
    title: 'Sign Up',
    pathname: '/sign-up',
  },
  chat: {
    title: 'Chat',
    pathname: '/chat',
  },
  profile: {
    title: 'Profile',
    pathname: '/profile',
  },
  notFound: {
    title: '404',
    pathname: '/404',
  },
  error: {
    title: 'Error',
    pathname: '/error',
  },
}

export type RoutesTypes = typeof routes

export default routes

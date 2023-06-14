const routes = {
  signIn: {
    pathname: '/',
    allowedPaths: [],
  },
  signUp: {
    pathname: '/sign-up',
    allowedPaths: [],
  },
  chat: {
    pathname: '/messenger',
    allowedPaths: ['/settings'],
  },
  notFound: {
    pathname: '/not-found',
    allowedPaths: [],
  },
  error: {
    pathname: '/error',
    allowedPaths: [],
  },
}

export type RoutesTypes = typeof routes

export default routes

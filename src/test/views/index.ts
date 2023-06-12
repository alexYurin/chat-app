import { layouts } from '../layouts'

class TestChatView {
  static id = 'chat'
  static title = 'Чат'
  static pathname = '/messenger'
  static allowedPaths = ['/settings']

  constructor() {
    return new layouts.TestChatLayout('chat-test-page', {})
  }
}

class TestSignInView {
  static id = 'signIn'
  static title = 'Вход'
  static pathname = '/'
  static allowedPaths = []

  constructor() {
    return new layouts.TestAuthLayout('sign-in-test-page', {})
  }
}

class TestSignUpView {
  static id = 'signUp'
  static title = 'Регистрация'
  static pathname = '/sign-up'
  static allowedPaths = []

  constructor() {
    return new layouts.TestAuthLayout('sign-up-test-page', {})
  }
}

class TestNotFoundView {
  static id = 'notFound'
  static title = '404'
  static pathname = '/not-found'
  static allowedPaths = []

  constructor() {
    return new layouts.TestPlaceholderLayout('not-found-test-page', {})
  }
}

class TestErrorView {
  static id = 'error'
  static title = '500'
  static pathname = '/error'
  static allowedPaths = []

  constructor() {
    return new layouts.TestPlaceholderLayout('error-test-page', {})
  }
}

export {
  TestChatView,
  TestSignInView,
  TestSignUpView,
  TestNotFoundView,
  TestErrorView,
}

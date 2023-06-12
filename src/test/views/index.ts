import { TestAuthLayout, TestChatLayout } from '../layouts'

class TestChatView {
  static id = 'chat'
  static title = 'Чат'
  static pathname = '/messenger'
  static allowedPaths = ['/settings']

  constructor() {
    return new TestChatLayout('chat-test-page', {})
  }
}

class TestSignInView {
  static id = 'signIn'
  static title = 'Вход'
  static pathname = '/'
  static allowedPaths = []

  constructor() {
    return new TestAuthLayout('sign-in-test-page', {})
  }
}

class TestSignUpView {
  static id = 'signUp'
  static title = 'Регистрация'
  static pathname = '/sign-up'
  static allowedPaths = []

  constructor() {
    return new TestAuthLayout('sign-up-test-page', {})
  }
}

export { TestChatView, TestSignInView, TestSignUpView }

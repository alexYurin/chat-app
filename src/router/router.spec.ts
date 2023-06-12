import Router from './Router'
import { TestChatView, TestSignInView, TestSignUpView } from '../test/views'
import { assert, expect } from 'chai'

describe('Роутер', () => {
  Router.use(TestChatView).use(TestSignInView).use(TestSignUpView)

  it('Переходы роутера', () => {
    // Router.navigate(routes.notFound.pathname)
    // console.log(Router)
  })
})

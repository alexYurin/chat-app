import Router from './Router'
import { UserType } from 'types/user'
import { ViewType } from './Route'
import store from 'services/Store'
import {
  TestChatView,
  TestSignInView,
  TestSignUpView,
  TestNotFoundView,
  TestErrorView,
} from 'test/views'
import { expect } from 'chai'

const testViews = [
  TestChatView,
  TestSignInView,
  TestSignUpView,
  TestNotFoundView,
  TestErrorView,
]

describe('Роутер', () => {
  testViews.forEach((testView) => {
    Router.use(testView as ViewType)
  })

  Router.run()

  describe('Переходы роутера', () => {
    it('Переход назад', () => {
      Router.navigate('/settings')

      Router.back()

      expect(Router.getHistory().getLength()).to.eq(2)
    })

    it('Переход на неизвестный роут', () => {
      Router.navigate('/not-expected-route')

      const path = Router.getCurentPathname()

      expect(path).to.eq('/not-found')
    })

    it('Переход на страницу списка чатов без авторизации', () => {
      Router.navigate('/messenger')

      const path = Router.getCurentPathname()

      expect(path).to.eq('/')
    })

    it('Переход на страницу списка чатов с авторизацией', () => {
      store.set('user', {} as UserType)

      Router.navigate('/messenger')

      const path = Router.getCurentPathname()

      expect(path).to.eq('/messenger')
    })
  })
})

import routes from 'router/routes'
import { AuthLayout } from 'layouts/index'

const { pathname, title } = routes.signIn

export default new AuthLayout({ pathname, pageTitle: title }).createModel({
  title,
  submitButtonText: 'Вход',
  footerLinkUrl: routes.signUp.pathname,
  footerLinkText: 'Нет аккаунта?',
  backLinkUrl: routes.pages.pathname,
  backLinkText: 'К списку страниц',
  fields: [
    {
      label: 'Логин',
      input: {
        name: 'login',
        type: 'text',
        required: true,
      },
    },
    {
      label: 'Пароль',
      input: {
        name: 'password',
        type: 'password',
        required: true,
      },
    },
  ],
})

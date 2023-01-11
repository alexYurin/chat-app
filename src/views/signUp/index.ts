import routes from 'router/routes'
import { AuthLayout } from 'layouts/index'

const { pathname, title } = routes.signUp

export default new AuthLayout({ pathname, pageTitle: title }).createModel({
  title,
  submitButtonText: 'Зарегистрироваться',
  footerLinkUrl: routes.signIn.pathname,
  footerLinkText: 'Войти',
  backLinkUrl: routes.pages.pathname,
  backLinkText: 'К списку страниц',
  fields: [
    {
      label: 'Почта',
      input: {
        name: 'email',
        type: 'email',
        required: true,
      },
    },
    {
      label: 'Логин',
      input: {
        name: 'login',
        type: 'text',
        required: true,
      },
    },
    {
      label: 'Имя',
      input: {
        name: 'login',
        type: 'text',
        required: true,
      },
    },
    {
      label: 'Фамилия',
      input: {
        name: 'password',
        type: 'password',
        required: true,
      },
    },
    {
      label: 'Телефон',
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
    {
      label: 'Пароль (ещё раз)',
      input: {
        name: 'password',
        type: 'password',
        required: true,
      },
    },
  ],
})

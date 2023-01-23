import routes from 'router/routes'
import { AuthLayout } from 'layouts/index'

const { pathname, title } = routes.signIn

export default new AuthLayout({ pathname, pageTitle: title }).create({
  title,
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
  authLink: {
    href: routes.signUp.pathname,
    slot: 'Нет аккаунта?',
  },
  actionButtons: [
    {
      button: {
        status: 'primary',
        slot: 'Вход',
      },
    },
  ],
})

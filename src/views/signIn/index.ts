import routes from 'router/routes'
import { AuthLayout } from 'layouts/index'

const { pathname, title } = routes.signIn

const props = {
  pathname,
  screenTitle: title,
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
    children: ['Нет аккаунта?'],
  },
  actionButtons: [
    {
      button: {
        status: 'primary',
        children: ['Вход'],
      },
    },
  ],
}

export default new AuthLayout('signIn', props)

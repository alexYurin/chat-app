import routes from 'router/routes'
import { BaseLayoutParamsType } from 'layouts/Base'
import AuthLayout, { AuthLayoutProps } from 'layouts/Auth/index'

const { pathname, title } = routes.signIn

const params: BaseLayoutParamsType<AuthLayoutProps> = {
  name: 'signIn',
  props: {
    pathname,
    documentTitle: title,
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
  },
}

export default new AuthLayout(params)

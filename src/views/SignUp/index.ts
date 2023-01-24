import routes from 'router/routes'
import { BaseLayoutParamsType } from 'layouts/Base'
import AuthLayout, { AuthLayoutProps } from 'layouts/Auth/index'

const { pathname, title } = routes.signUp

const params: BaseLayoutParamsType<AuthLayoutProps> = {
  name: 'signUp',
  props: {
    pathname,
    documentTitle: title,
    title,
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
          name: 'first_name',
          type: 'text',
          required: true,
        },
      },
      {
        label: 'Фамилия',
        input: {
          name: 'second_name',
          type: 'text',
          required: true,
        },
      },
      {
        label: 'Телефон',
        input: {
          name: 'phone',
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
          name: 'password_confirm',
          type: 'password',
          required: true,
        },
      },
    ],
    authLink: {
      href: routes.signIn.pathname,
      children: ['Войти'],
    },
    actionButtons: [
      {
        button: {
          status: 'primary',
          type: 'submit',
          children: ['Зарегистрироваться'],
        },
      },
    ],
  },
}

export default new AuthLayout(params)

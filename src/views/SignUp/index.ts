import routes from 'router/routes'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signUp

export default {
  Layout: AuthLayout,
  props: {
    name,
    pathname,
    documentTitle: title,
    data: {
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
    },
  },
}

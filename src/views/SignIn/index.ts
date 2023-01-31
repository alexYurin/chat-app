import routes from 'router/routes'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signIn

export default new AuthLayout({
  name,
  props: {
    pathname,
    documentTitle: title,
    data: {
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
    },
  },
})

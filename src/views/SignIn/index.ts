import routes from 'router/routes'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signIn

export default new AuthLayout({
  name,
  props: {
    pathname,
    instanceName: name,
    documentTitle: title,
    data: {
      title,
      fields: [
        {
          instanceName: 'field-login',
          label: 'Логин',
          input: {
            instanceName: 'input-login',
            name: 'login',
            type: 'text',
            required: true,
          },
        },
        {
          instanceName: 'field-password',
          label: 'Пароль',
          input: {
            instanceName: 'input-login',
            name: 'password',
            type: 'password',
            required: true,
          },
        },
      ],
      authLink: {
        instanceName: 'auth-link',
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
  },
})

import routes from 'router/routes'
import Validation from 'components/Form/Validation'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signIn

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
          label: 'Логин',
          input: {
            name: 'login',
            type: 'text',
            validation: Validation.rules.login,
          },
        },
        {
          label: 'Пароль',
          input: {
            name: 'password',
            type: 'password',
            validation: Validation.rules.password,
          },
        },
      ],
      submitButtonText: 'Вход',
      authLink: {
        href: routes.signUp.pathname,
        children: ['Нет аккаунта?'],
      },
    },
  },
}

import routes from 'router/routes'
import Validation from 'components/Form/Validation'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signIn

const createView = () => {
  return new AuthLayout(name, {
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
      isRoute: true,
      children: ['Нет аккаунта?'],
    },
  })
}

export type ViewSignInType = ReturnType<typeof createView>

export default {
  title,
  pathname,
  createView,
}

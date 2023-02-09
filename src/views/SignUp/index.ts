import routes from 'router/routes'
import Validation from 'components/Form/Validation'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signUp

const createView = () => {
  return new AuthLayout(name, {
    title,
    fields: [
      {
        label: 'Почта',
        input: {
          name: 'email',
          type: 'email',
          validation: Validation.rules.email,
        },
      },
      {
        label: 'Логин',
        input: {
          name: 'login',
          type: 'text',
          validation: Validation.rules.login,
        },
      },
      {
        label: 'Имя',
        input: {
          name: 'first_name',
          type: 'text',
          validation: Validation.rules.first_name,
        },
      },
      {
        label: 'Фамилия',
        input: {
          name: 'second_name',
          type: 'text',
          validation: Validation.rules.second_name,
        },
      },
      {
        label: 'Телефон',
        input: {
          name: 'phone',
          type: 'text',
          validation: Validation.rules.phone,
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
      {
        label: 'Пароль (ещё раз)',
        input: {
          name: 'password_confirm',
          type: 'password',
          validation: Validation.rules.password_confirm,
        },
      },
    ],
    submitButtonText: 'Зарегистрироваться',
    authLink: {
      href: routes.signIn.pathname,
      isRoute: true,
      children: ['Войти'],
    },
  })
}

export type ViewSignUpType = ReturnType<typeof createView>

export default {
  title,
  pathname,
  createView,
}

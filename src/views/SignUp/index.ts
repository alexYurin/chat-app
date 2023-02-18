import Validation from 'components/Form/Validation'
import AuthLayout from 'layouts/Auth/index'
import SignInView from 'views/SignIn'

export default class SignUpView {
  static id = 'signUp'
  static title = 'Регистрация'
  static pathname = '/sign-up'

  constructor() {
    return new AuthLayout(SignUpView.id, {
      title: 'Регистрация',
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
        href: SignInView.pathname,
        isRoute: true,
        children: ['Войти'],
      },
    })
  }
}

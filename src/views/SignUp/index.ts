import routes from 'router/routes'
import AuthLayout from 'layouts/Auth/index'

const { name, pathname, title } = routes.signUp

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
          instanceName: 'field-email',
          label: 'Почта',
          input: {
            instanceName: 'input-email',
            name: 'email',
            type: 'email',
            required: true,
          },
        },
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
          instanceName: 'field-first-name',
          label: 'Имя',
          input: {
            instanceName: 'input-first-name',
            name: 'first_name',
            type: 'text',
            required: true,
          },
        },
        {
          instanceName: 'field-second-name',
          label: 'Фамилия',
          input: {
            instanceName: 'input-second-name',
            name: 'second_name',
            type: 'text',
            required: true,
          },
        },
        {
          instanceName: 'field-phone',
          label: 'Телефон',
          input: {
            instanceName: 'input-phone',
            name: 'phone',
            type: 'text',
            required: true,
          },
        },
        {
          instanceName: 'field-password',
          label: 'Пароль',
          input: {
            instanceName: 'input-password',
            name: 'password',
            type: 'password',
            required: true,
          },
        },
        {
          instanceName: 'field-password-confirm',
          label: 'Пароль (ещё раз)',
          input: {
            instanceName: 'input-password-confirm',
            name: 'password_confirm',
            type: 'password',
            required: true,
          },
        },
      ],
      authLink: {
        instanceName: 'auth-link',
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
  },
})

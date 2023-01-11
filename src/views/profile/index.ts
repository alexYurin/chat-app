import routes from 'router/routes'
import { ProfileLayout } from 'layouts/index'

const { pathname, title } = routes.profile

export default new ProfileLayout({ pathname, pageTitle: title }).createModel({
  title,
  changeDataLinkUrl: '#',
  changeDataLinkText: 'Изменить данные',
  changePasswordLinkUrl: '#',
  changePasswordLinkText: 'Изменить пароль',
  logoutLinkUrl: '/',
  logoutLinkText: 'Выйти',
  submitButtonText: 'Сохранить',
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
  ],
})

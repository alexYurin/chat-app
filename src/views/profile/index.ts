import routes from 'router/routes'
import { ProfileLayout } from 'layouts/index'
import avatarPlaceholderIconSrc from 'data-url:static/images/image-placeholder.svg'

const { pathname, title } = routes.profile

export default new ProfileLayout({ pathname, pageTitle: title }).createModel({
  title,
  avatar: {
    src: avatarPlaceholderIconSrc,
    fieldName: 'avatar',
    alt: 'Аватар',
  },
  fields: [
    {
      label: 'Почта',
      input: {
        name: 'email',
        type: 'email',
        value: 'pochta@yandex.ru',
        required: true,
      },
    },
    {
      label: 'Логин',
      input: {
        name: 'login',
        type: 'text',
        value: 'ivanivanov',
        required: true,
      },
    },
    {
      label: 'Имя',
      input: {
        name: 'first_name',
        type: 'text',
        value: 'Иван',
        required: true,
      },
    },
    {
      label: 'Фамилия',
      input: {
        name: 'second_name',
        type: 'text',
        value: 'Иван',
        required: true,
      },
    },
    {
      label: 'Имя в чате',
      input: {
        name: 'display_name',
        type: 'text',
        value: 'Иванов',
      },
    },
    {
      label: 'Телефон',
      input: {
        name: 'phone',
        type: 'text',
        value: 'Иван',
        required: true,
      },
    },
  ],
})

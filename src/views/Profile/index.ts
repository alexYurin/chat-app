import routes from 'router/routes'
import ProfileLayout from 'layouts/Profile/index'
import avatarPlaceholderIconSrc from 'data-url:static/images/image-placeholder.svg'

const { name, pathname, title } = routes.profile

export default new ProfileLayout({
  name,
  props: {
    pathname,
    instanceName: name,
    documentTitle: title,
    data: {
      avatar: {
        src: avatarPlaceholderIconSrc,
        fieldName: 'avatar',
        alt: 'Аватар',
      },
      fields: [
        {
          instanceName: 'field-email',
          label: 'Почта',
          input: {
            instanceName: 'input-email',
            name: 'email',
            type: 'email',
            value: 'pochta@yandex.ru',
            required: true,
          },
        },
        {
          instanceName: 'field-login',
          label: 'Логин',
          input: {
            instanceName: 'input-email',
            name: 'login',
            type: 'text',
            value: 'ivanivanov',
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
            value: 'Иван',
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
            value: 'Иван',
            required: true,
          },
        },
        {
          instanceName: 'field-display-name',
          label: 'Имя в чате',
          input: {
            instanceName: 'input-display-name',
            name: 'display_name',
            type: 'text',
            value: 'Иванов',
          },
        },
        {
          instanceName: 'field-phone-name',
          label: 'Телефон',
          input: {
            instanceName: 'input-phone-name',
            name: 'phone',
            type: 'text',
            value: '+7 (909) 967 30 30',
            required: true,
          },
        },
      ],
    },
  },
})

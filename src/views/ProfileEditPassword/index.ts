import routes from 'router/routes'
import ProfileEditPasswordLayout from 'layouts/ProfileEditPassword/index'
import avatarPlaceholderIconSrc from 'data-url:static/images/image-placeholder.svg'

const { name, pathname, title } = routes.profileEditPassword

export default new ProfileEditPasswordLayout({
  name,
  props: {
    instanceName: name,
    pathname,
    documentTitle: title,
    data: {
      avatar: {
        src: avatarPlaceholderIconSrc,
        fieldName: 'avatar',
        alt: 'Аватар',
      },
      fields: [
        {
          instanceName: 'field-old-password',
          label: 'Старый пароль',
          input: {
            instanceName: 'input-old-password',
            name: 'oldPassword',
            type: 'password',
            required: true,
          },
        },
        {
          instanceName: 'field-password-password',
          label: 'Новый пароль',
          input: {
            instanceName: 'input-password',
            name: 'password',
            type: 'text',
            required: true,
          },
        },
        {
          instanceName: 'field-password-confirm',
          label: 'Повторите новый пароль',
          input: {
            instanceName: 'input-password-configrm',
            name: 'password_confirm',
            type: 'password',
            required: true,
          },
        },
      ],
    },
  },
})

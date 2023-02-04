import routes from 'router/routes'
import Validation from 'components/Form/Validation'
import ProfileEditPasswordLayout from 'layouts/ProfileEditPassword/index'
import avatarPlaceholderIconSrc from 'data-url:static/images/image-placeholder.svg'

const { name, pathname, title } = routes.profileEditPassword

export default {
  Layout: ProfileEditPasswordLayout,
  props: {
    name,
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
          label: 'Старый пароль',
          input: {
            name: 'oldPassword',
            type: 'password',
            validation: Validation.rules.password,
          },
        },
        {
          label: 'Новый пароль',
          input: {
            name: 'password',
            type: 'text',
            validation: Validation.rules.password,
          },
        },
        {
          label: 'Повторите новый пароль',
          input: {
            name: 'password_confirm',
            type: 'password',
            validation: Validation.rules.password_confirm,
          },
        },
      ],
    },
  },
}

import routes from 'router/routes'
import ProfileEditPasswordLayout, {
  ProfileEditPasswordLayoutProps,
} from 'layouts/ProfileEditPassword/index'
import { BaseLayoutParamsType } from 'layouts/Base'
import avatarPlaceholderIconSrc from 'data-url:static/images/image-placeholder.svg'

const { pathname, title } = routes.profileEditPassword

const params: BaseLayoutParamsType<ProfileEditPasswordLayoutProps> = {
  name: 'profileEdit',
  props: {
    pathname,
    documentTitle: title,
    title,
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
          required: true,
        },
      },
      {
        label: 'Новый пароль',
        input: {
          name: 'password',
          type: 'text',
          required: true,
        },
      },
      {
        label: 'Повторите новый пароль',
        input: {
          name: 'password_confirm',
          type: 'password',
          required: true,
        },
      },
    ],
  },
}

export default new ProfileEditPasswordLayout(params)

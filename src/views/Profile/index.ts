import Validation from 'components/Form/Validation'
import ProfileLayout from 'layouts/Profile/index'
import avatarPlaceholderIconSrc from 'data-url:static/images/image-placeholder.svg'

export default class ProfileView {
  static id = 'profile'
  static title = 'Профиль (Настройки)'
  static pathname = '/profile'

  constructor() {
    return new ProfileLayout(ProfileView.id, {
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
            validation: Validation.rules.email,
          },
        },
        {
          label: 'Логин',
          input: {
            name: 'login',
            type: 'text',
            value: 'ivanivanov',
            validation: Validation.rules.login,
          },
        },
        {
          label: 'Имя',
          input: {
            name: 'first_name',
            type: 'text',
            value: 'Иван',
            validation: Validation.rules.first_name,
          },
        },
        {
          label: 'Фамилия',
          input: {
            name: 'second_name',
            type: 'text',
            value: 'Иван',
            validation: Validation.rules.second_name,
          },
        },
        {
          label: 'Имя в чате',
          input: {
            name: 'display_name',
            type: 'text',
            value: 'Иванов',
            validation: Validation.rules.display_name,
          },
        },
        {
          label: 'Телефон',
          input: {
            name: 'phone',
            type: 'text',
            value: '+79099673030',
            validation: Validation.rules.phone,
          },
        },
      ],
    })
  }
}

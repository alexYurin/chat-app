import Validation from 'components/Form/Validation'
import ChatLayout from 'layouts/Chat/index'

import avatarPlaceholderSrc from 'data-url:static/images/avatar-placeholder.svg'

export default class ChatView {
  static id = 'chat'
  static title = 'Чат'
  static pathname = '/messenger'

  constructor() {
    return new ChatLayout(ChatView.id, {
      avatar: {
        src: avatarPlaceholderSrc,
        alt: 'profile-avatar',
      },
      avatarInput: {
        id: 'user_avatar',
        type: 'file',
        name: 'avatar',
        accept: 'image/*',
        className:
          'chat-layout__trigger-input chat-layout__trigger-input_avatar',
        isCustom: true,
      },
      profileFields: [
        {
          label: 'Почта',
          input: {
            name: 'email',
            type: 'email',
            placeholder: 'Нет данных',
            validation: Validation.rules.email,
          },
        },
        {
          label: 'Логин',
          input: {
            name: 'login',
            type: 'text',
            placeholder: 'Нет данных',
            validation: Validation.rules.login,
          },
        },
        {
          label: 'Имя',
          input: {
            name: 'first_name',
            type: 'text',
            placeholder: 'Нет данных',
            validation: Validation.rules.first_name,
          },
        },
        {
          label: 'Фамилия',
          input: {
            name: 'second_name',
            type: 'text',
            placeholder: 'Нет данных',
            validation: Validation.rules.second_name,
          },
        },
        {
          label: 'Имя в чате',
          input: {
            name: 'display_name',
            type: 'text',
            placeholder: 'Нет данных',
            validation: Validation.rules.display_name,
          },
        },
        {
          label: 'Телефон',
          input: {
            name: 'phone',
            type: 'text',
            placeholder: 'Нет данных',
            validation: Validation.rules.phone,
          },
        },
      ],
      passwordFields: [
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
            name: 'newPassword',
            type: 'password',
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
      messageFields: [
        {
          label: '',
          input: {
            name: 'message',
            type: 'text',
            value: '',
            validation: Validation.rules.message,
          },
        },
      ],
    })
  }
}

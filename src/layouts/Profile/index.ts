import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import routes from 'router/routes'
import { HistoryPusher } from 'services/index'
import { Form, Button, Link } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import './styles.scss'

export interface ProfileDataType {
  fields: FormProps['fields']
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

export type ProfileChildrenPropsType = [
  string,
  string,
  string,
  Form,
  Link,
  Link,
  Link,
  Button,
  Link
]

const triggerFormEdit = (event: Event) => {
  event.preventDefault()

  const layout = document.querySelector('.profile-layout')
  const form = document.querySelector('.profile-layout__form')

  layout?.classList.add('profile-layout_editable')
  form?.classList.remove('form_readonly')
}

export default class ProfileLayout extends BaseLayout<
  ProfileChildrenPropsType,
  ProfileDataType
> {
  protected template = layout

  init() {
    const { fields, avatar } = this.data

    const validate = (event: Event, currentInputProps: InputProps) => {
      Form.validate(event, currentInputProps, this.props.children)
    }

    const onSubmit = (event: Event) => {
      const isValidForm = Form.onSubmit(event, this.props.children)

      if (isValidForm) {
        const isRedirect = confirm(
          'Форма успешно отправлена. Перейти в профиль?'
        )

        if (isRedirect) {
          return HistoryPusher.pushTo(routes.profile.pathname)
        }
      }
    }

    this.props.children = [
      avatar.fieldName,
      avatar.src,
      avatar.alt,
      new Form({
        id: 'profile-form',
        readonly: true,
        className: 'profile-layout__form scroll',
        fields: fields.map(({ label, input }) => {
          input.listeners = [
            {
              eventType: 'focus',
              callback: (event: Event) => validate(event, input),
            },
            {
              eventType: 'blur',
              callback: (event: Event) => validate(event, input),
            },
          ]

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: onSubmit,
          },
        ],
      }),
      new Link({
        href: '#',
        children: ['Изменить данные'],
        listeners: [
          {
            eventType: 'click',
            callback: triggerFormEdit,
          },
        ],
      }),
      new Link({
        href: routes.profileEditPassword.pathname,
        children: ['Изменить пароль'],
      }),
      new Link({
        href: '/',
        children: ['Выйти'],
      }),
      new Button({
        form: 'profile-form',
        status: 'primary',
        type: 'submit',
        children: ['Сохранить'],
      }),
      new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    ]
  }
}

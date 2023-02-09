import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import routes from 'router/routes'
import { HistoryPusher } from 'services/index'
import { Form, Button, Link } from 'components/index'
import { InputProps } from 'components/Input'
import { ProfileEditPasswordPropsType } from './types'

export default class ProfileEditPassordLayout extends BaseLayout<ProfileEditPasswordPropsType> {
  protected template = layout

  init() {
    const { fields, avatar } = this.props

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
        readonly: false,
        className: 'profile-layout__form',
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
      new Button({
        form: 'profile-form',
        status: 'primary',
        type: 'submit',
        children: ['Сохранить'],
      }),
      new Link({
        href: '/',
        isRoute: true,
        children: ['К списку страниц'],
      }),
    ]
  }
}

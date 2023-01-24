import { Button, Form, Link } from 'components/index'
import { FieldType } from 'components/Form'
import { BaseControllerProps } from 'core/BaseLayout'
import BaseModel from 'core/BaseModel'
import routes from 'router/routes'

export interface ProfileModelType {
  title: string
  avatarSrc: string
  avatarAlt: string
  avatarFieldName: string
  form: Form
  changeDataLink: Link
  changePasswordLink: Link
  logoutLink: Link
  saveButton: Button
  backLink: Link
}

export interface ProfileModelProps extends BaseControllerProps {
  title: string
  fields: FieldType[]
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

const triggerFormEdit = (event: Event) => {
  event.preventDefault()

  const layout = document.querySelector('.profile-layout')
  const form = document.querySelector('.profile-layout__form')

  layout?.classList.add('profile-layout_editable')
  form?.classList.remove('form_readonly')
}

export default class ProfileModel extends BaseModel<
  ProfileModelProps,
  ProfileModelType
> {
  constructor(props: ProfileModelProps) {
    super(props)
  }

  init() {
    const { title, fields, avatar } = this.props

    this.model = {
      title,
      avatarSrc: avatar.src,
      avatarAlt: avatar.alt,
      avatarFieldName: avatar.fieldName,
      form: new Form({
        id: 'profile-form',
        readonly: true,
        className: 'profile-layout__form',
        fields,
        actionButtons: [],
      }),
      changeDataLink: new Link(
        {
          href: '#',
          children: ['Изменить данные'],
        },
        {
          listeners: [
            {
              eventType: 'click',
              callback: triggerFormEdit,
            },
          ],
        }
      ),
      changePasswordLink: new Link({
        href: routes.profileEditPassword.pathname,
        children: ['Изменить пароль'],
      }),
      logoutLink: new Link({
        href: '/',
        children: ['Выйти'],
      }),
      saveButton: new Button({
        form: 'profile-form',
        status: 'primary',
        type: 'submit',
        children: ['Сохранить'],
      }),
      backLink: new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    }
  }
}

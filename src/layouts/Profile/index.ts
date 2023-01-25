import layout from 'bundle-text:./layout.pug'
import BaseLayout, {
  BaseLayoutProps,
  BaseLayoutParamsType,
} from 'layouts/Base/index'
import { Form, Button, Link } from 'components/index'
import { FieldType } from 'components/Form'
import routes from 'router/routes'
import './styles.scss'

export interface ProfileLayoutProps extends BaseLayoutProps {
  title: string
  fields: FieldType[]
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

export type ProfileLayoutMapType = {
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

const triggerFormEdit = (event: Event) => {
  event.preventDefault()

  const layout = document.querySelector('.profile-layout')
  const form = document.querySelector('.profile-layout__form')

  layout?.classList.add('profile-layout_editable')
  form?.classList.remove('form_readonly')
}

export default class ProfileLayout extends BaseLayout<
  ProfileLayoutProps,
  ProfileLayoutMapType
> {
  protected template = layout

  constructor(params: BaseLayoutParamsType<ProfileLayoutProps>) {
    super(params)
  }

  init() {
    const { title, fields, avatar } = this.getProps()

    this.map = {
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

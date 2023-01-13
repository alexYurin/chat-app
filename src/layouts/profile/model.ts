import { Link, Button, Form } from 'components/index'
import { FieldType } from 'components/Form'
import { BaseModelType } from 'layouts/LayoutModel'
import routes from 'router/routes'

export interface ProfileModelType extends BaseModelType {
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

const modelConstructor = ({ title, fields, avatar }: ProfileModelType) => ({
  title,
  avatarSrc: avatar.src,
  avatarAlt: avatar.alt,
  avatarFieldName: avatar.fieldName,
  form: new Form().create({
    id: 'profile-form',
    readonly: true,
    className: 'profile-layout__form',
    fields,
    actionButtons: [],
  }),
  changeDataLink: new Link({
    listeners: [
      {
        eventType: 'click',
        callback: triggerFormEdit,
      },
    ],
  }).create({
    href: '#',
    slot: 'Изменить данные',
  }),
  changePasswordLink: new Link().create({
    href: routes.profileEditPassword.pathname,
    slot: 'Изменить пароль',
  }),
  logoutLink: new Link().create({
    href: '/',
    slot: 'Выйти',
  }),
  saveButton: new Button().create({
    form: 'profile-form',
    status: 'primary',
    type: 'submit',
    slot: 'Сохранить',
  }),
  slot: new Link().create({
    href: '/',
    slot: 'К списку страниц',
  }),
})

export type ProfileModelConstructorType = ReturnType<typeof modelConstructor>

export default modelConstructor

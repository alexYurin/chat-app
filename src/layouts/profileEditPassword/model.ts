import { Link, Button, Form } from 'components/index'
import { FieldType } from 'components/Form'
import { BaseModelType } from 'layouts/LayoutController'

export interface ProfileModelType extends BaseModelType {
  fields: FieldType[]
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

const modelConstructor = ({ title, fields, avatar }: ProfileModelType) => ({
  title,
  avatarSrc: avatar.src,
  avatarAlt: avatar.alt,
  avatarFieldName: avatar.fieldName,
  form: new Form().create({
    id: 'profile-form',
    readonly: false,
    className: 'profile-layout__form',
    fields,
    actionButtons: [],
  }),
  saveButton: new Button().create({
    form: 'profile-form',
    status: 'primary',
    type: 'submit',
    children: ['Сохранить'],
  }),
  slot: new Link().create({
    href: '/',
    children: ['К списку страниц'],
  }),
})

export type ProfileModelConstructorType = ReturnType<typeof modelConstructor>

export default modelConstructor

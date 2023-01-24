import { Button, Form, Link } from 'components/index'
import { FieldType } from 'components/Form'
import { BaseControllerProps } from 'core/BaseLayout'
import BaseModel from 'core/BaseModel'

export interface ProfileEditModelType {
  title: string
  avatarSrc: string
  avatarAlt: string
  avatarFieldName: string
  form: Form
  saveButton: Button
  backLink: Link
}

export interface ProfileEditModelProps extends BaseControllerProps {
  title: string
  fields: FieldType[]
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

export default class ProfileEditModel extends BaseModel<
  ProfileEditModelProps,
  ProfileEditModelType
> {
  constructor(props: ProfileEditModelProps) {
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
        readonly: false,
        className: 'profile-layout__form',
        fields,
        actionButtons: [],
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

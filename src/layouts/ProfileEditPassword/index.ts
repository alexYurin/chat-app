import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Form, Button, Link } from 'components/index'
import { FieldType } from 'components/Form'

export interface ProfileEditPasswordDataType {
  fields: FieldType[]
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

export type ProfileEditPasswordPropsType = [
  string,
  string,
  string,
  Form,
  Button,
  Link
]

export default class ProfileEditPassordLayout extends BaseLayout<
  ProfileEditPasswordPropsType,
  ProfileEditPasswordDataType
> {
  protected template = layout

  init() {
    const { fields, avatar } = this.data

    this.props.children = [
      avatar.fieldName,
      avatar.src,
      avatar.alt,
      new Form({
        id: 'profile-form',
        readonly: false,
        className: 'profile-layout__form',
        fields,
        actionButtons: [],
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

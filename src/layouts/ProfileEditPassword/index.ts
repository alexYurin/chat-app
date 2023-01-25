import layout from 'bundle-text:./layout.pug'
import BaseLayout, {
  BaseLayoutProps,
  BaseLayoutParamsType,
} from 'layouts/Base/index'
import { Form, Button, Link } from 'components/index'
import { FieldType } from 'components/Form'

export interface ProfileEditPasswordLayoutProps extends BaseLayoutProps {
  title: string
  fields: FieldType[]
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
}

export type ProfileEditPasswordLayoutMapType = {
  title: string
  avatarSrc: string
  avatarAlt: string
  avatarFieldName: string
  form: Form
  saveButton: Button
  backLink: Link
}

export default class ProfileEditPassordLayout extends BaseLayout<
  ProfileEditPasswordLayoutProps,
  ProfileEditPasswordLayoutMapType
> {
  protected template = layout

  constructor(params: BaseLayoutParamsType<ProfileEditPasswordLayoutProps>) {
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

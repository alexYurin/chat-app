import { Title, Form, Link } from 'components/index'
import { FieldType, ButtonsFieldType } from 'components/Form'
import { LinkProps } from 'components/Link'
import { BaseModelType } from 'layouts/LayoutModel'

export interface AuthModelType extends BaseModelType {
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
  authLink: LinkProps
}

function modelConstructor({
  title,
  fields,
  actionButtons,
  authLink,
}: AuthModelType) {
  return {
    title: new Title({
      className: 'auth-layout__title',
      level: 1,
      children: [title],
    }).create(),
    authLink: new Link().create(authLink),
    form: new Form({
      className: 'auth-layout__form',
      fields,
      actionButtons,
    }).create(),
    children: new Link({
      href: '/',
      children: ['К списку страниц'],
    }).create(),
  }
}

modelConstructor.components = [Title, Link]

export type AuthModelConstructorType = ReturnType<typeof modelConstructor>

export default modelConstructor

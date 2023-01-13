import { Title, Form, Link } from 'components/index'
import { FieldType, ButtonsFieldType } from 'components/Form'
import { LinkProps } from 'components/Link'
import { BaseModelType } from 'layouts/LayoutModel'

export interface AuthModelType extends BaseModelType {
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
  authLink: LinkProps
}

const modelConstructor = ({
  title,
  fields,
  actionButtons,
  authLink,
}: AuthModelType) => ({
  title: new Title().create({
    className: 'auth-layout__title',
    level: 1,
    slot: title,
  }),
  authLink: new Link().create(authLink),
  form: new Form().create({
    className: 'auth-layout__form',
    fields,
    actionButtons,
  }),
  slot: new Link().create({
    href: '/',
    slot: 'К списку страниц',
  }),
})

export type AuthModelConstructorType = ReturnType<typeof modelConstructor>

export default modelConstructor

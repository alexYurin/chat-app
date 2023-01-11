import { Title, Link, Input, Button } from 'components/index'
import { BaseModelType } from 'layouts/LayoutModel'

export type ProfileFieldType = {
  label: string
  input: {
    type: string
    name: string
    required: boolean
  }
}

export interface ProfileModelType extends BaseModelType {
  fields: ProfileFieldType[]
  submitButtonText: string
  changeDataLinkUrl: string
  changeDataLinkText: string
  changePasswordLinkUrl: string
  changePasswordLinkText: string
  logoutLinkUrl: string
  logoutLinkText: string
}

const modelConstructor = ({
  title,
  fields,
  submitButtonText,
  changeDataLinkUrl,
  changeDataLinkText,
  changePasswordLinkUrl,
  changePasswordLinkText,
  logoutLinkUrl,
  logoutLinkText,
}: ProfileModelType) => ({
  title: new Title().create({
    level: 1,
    slot: title,
  }),
  fields: fields.map(({ label, input }) => ({
    label,
    input: new Input().create({
      type: input.type,
      name: input.name,
      required: input.required,
    }),
  })),
  changeDataLink: new Link().create({
    href: changeDataLinkUrl,
    slot: changeDataLinkText,
  }),
  changePasswordLink: new Link().create({
    href: changePasswordLinkUrl,
    slot: changePasswordLinkText,
  }),
  logoutLink: new Link().create({
    href: logoutLinkUrl,
    slot: logoutLinkText,
  }),
  submitButton: new Button().create({
    type: 'submit',
    slot: submitButtonText,
  }),
  backLink: new Link().create({
    href: '/',
    slot: 'К списку страниц',
  }),
})

export type ProfileModelConstructorType = ReturnType<typeof modelConstructor>

export default modelConstructor

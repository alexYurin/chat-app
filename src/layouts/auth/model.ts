import { Title, Link, Input, Button } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type AuthFieldType = {
  label: string
  input: {
    type: string
    name: string
    required: boolean
  }
}

export interface AuthModelType extends BaseModelType {
  fields: AuthFieldType[]
  submitButtonText: string
  footerLinkUrl: string
  footerLinkText: string
  backLinkUrl: string
  backLinkText: string
}

const createModel = ({
  title,
  fields,
  submitButtonText,
  footerLinkUrl,
  footerLinkText,
  backLinkUrl,
  backLinkText,
}: AuthModelType) => ({
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
  submitButton: new Button().create({
    type: 'submit',
    slot: submitButtonText,
  }),
  footerLink: new Link().create({
    href: footerLinkUrl,
    slot: footerLinkText,
  }),
  backLink: new Link().create({
    href: backLinkUrl,
    slot: backLinkText,
  }),
})

export default createModel

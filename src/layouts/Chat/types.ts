import { BaseComponentProps } from 'components/Base'
import { Form, Button, Link } from 'components/index'
import { FormProps } from 'components/Form'

export type ChatFormType = Form
export type ChatSubmitButtonType = Button
export type BackLinkType = Link

export type ChatChildrenPropsType = [
  ChatFormType,
  ChatSubmitButtonType,
  BackLinkType
]

export interface ChatPropsType extends BaseComponentProps {
  fields: FormProps['fields']
  submitButtonText: string
  children?: ChatChildrenPropsType
}

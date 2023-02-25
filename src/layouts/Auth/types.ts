import { Title, Form, Loader, Button, Link } from 'components/index'
import { BaseComponentProps } from 'components/Base'
import { FormProps } from 'components/Form'
import { LinkProps } from 'components/Link'

export type AuthLoaderType = Loader
export type AuthTitleType = Title
export type AuthFormType = Form
export type AuthSwitchFormLinkType = Link
export type AuthSubmitButtonType = Button

export type AuthChildrenPropsType = [
  AuthLoaderType,
  AuthTitleType,
  AuthFormType,
  AuthSubmitButtonType,
  AuthSwitchFormLinkType
]

export interface AuthPropsType extends BaseComponentProps {
  title: string
  fields: FormProps['fields']
  submitButtonText: string
  authLink: LinkProps
  children?: AuthChildrenPropsType
}

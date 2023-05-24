import { BaseComponentProps } from 'components/Base'
import { FormProps } from 'components/Form'
import { LinkProps } from 'components/Link'

export interface AuthPropsType extends BaseComponentProps {
  title: string
  fields: FormProps['fields']
  submitButtonText: string
  authLink: LinkProps
}

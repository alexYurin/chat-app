import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import FormField, { FormFieldProps } from './Field'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface FormProps extends BaseComponentProps {
  name?: string
  action?: string
  method?: string
  target?: string
  disabled?: boolean
  readonly?: boolean
  fields: FormFieldProps[]
}

export default class Form extends BaseComponent<FormProps> {
  public template = templateString

  constructor(
    props: FormProps = {
      fields: [],
    }
  ) {
    super('form', props)

    this.props.children = [
      ...this.props.fields.map((fieldProps) => new FormField(fieldProps)),
    ]
  }
}

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import Input, { InputProps } from 'components/Input'
import templateString from 'bundle-text:./template.field.pug'

export interface FormFieldProps extends BaseComponentProps {
  label?: string
  input: InputProps
}

export default class FormField extends BaseComponent<FormFieldProps> {
  protected template = templateString

  constructor(props: FormFieldProps) {
    super('field', props)

    this.props.children = [props.label || '', new Input(props.input)]
  }
}

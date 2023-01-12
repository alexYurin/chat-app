import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
} from 'components/Base/index.'
import Input, { InputProps } from 'components/Input'
import Button, { ButtonProps } from 'components/Button'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export type FieldType = {
  label?: string
  input?: InputProps & {
    options?: BaseComponentOptions
  }
  inputTemplate?: string
}

export type ButtonsFieldType = {
  button?: ButtonProps & {
    options?: BaseComponentOptions
  }
  buttonTemplate?: string
}

export interface FormProps extends BaseComponentProps {
  name?: string
  action?: string
  method?: string
  target?: string
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
}

export default class Form extends BaseComponent<FormProps> {
  public template = templateString

  constructor(options: BaseComponentOptions = {}) {
    super('form', options)
  }

  public prepareProps(props: FormProps): FormProps {
    const preparedInputFields = (props.fields || []).map(({ label, input }) => {
      return {
        label,
        inputTemplate: input ? new Input().create(input) : '',
      }
    })

    const preparedActionButtons = (props.actionButtons || []).map(
      ({ button }) => {
        return {
          buttonTemplate: button ? new Button().create(button) : '',
        }
      }
    )

    props.fields = preparedInputFields
    props.actionButtons = preparedActionButtons

    return props
  }
}
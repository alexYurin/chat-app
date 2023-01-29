import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import Input, { InputProps } from 'components/Input'
import Button, { ButtonProps } from 'components/Button'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export type FieldType = {
  label?: string
  input: InputProps
}

export type ButtonsFieldType = {
  button?: ButtonProps
}

export interface FormProps extends BaseComponentProps {
  name?: string
  action?: string
  method?: string
  target?: string
  disabled?: boolean
  readonly?: boolean
  fields: FieldType[]
  actionButtons: ButtonsFieldType[]
}

export default class Form extends BaseComponent<FormProps> {
  public template = templateString

  constructor(
    props: FormProps = {
      fields: [],
      actionButtons: [],
    }
  ) {
    super('form', props)
  }

  // public prepareProps(props: FormProps): FormProps {
  //   const preparedInputFields = (props.fields || []).map(({ label, input }) => {
  //     return {
  //       label,
  //       inputTemplate: input ? new Input(input) : '',
  //     }
  //   })

  //   const preparedActionButtons = (props.actionButtons || []).map(
  //     ({ button }) => {
  //       return {
  //         buttonTemplate: button ? new Button(button) : '',
  //       }
  //     }
  //   )

  //   props.fields = preparedInputFields
  //   props.actionButtons = preparedActionButtons

  //   return props
  // }
}

import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import Validation, { ValidationProps } from 'components/Form/Validation'
import { InputProps } from 'components/Input'
import FormField, { FormFieldProps } from './Field'
import templateString from './template.pug'

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
  protected template = templateString

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

  static validate(
    event: Event,
    currentInputProps: InputProps,
    children: BaseComponentProps['children']
  ) {
    const validation = new Validation()

    const input = event.target as HTMLInputElement

    const inputInstance = BaseComponent.findParentComponent(
      event.target as EventTarget,
      children
    )

    if (currentInputProps?.validation) {
      const check = validation.check(
        currentInputProps.validation as unknown as ValidationProps,
        input.name,
        input.value
      )

      const props = check.isValid
        ? { message: undefined, status: undefined }
        : { status: 'alert', message: check.errorText }

      inputInstance?.setProps({ value: input.value, ...props } as InputProps)
    }
  }

  static preSubmitValidate<TFormValues = Record<string, string>>(
    event: Event,
    children: BaseComponentProps['children']
  ) {
    event.preventDefault()

    const validation = new Validation()
    const form = event.target as HTMLFormElement

    const fields = {
      values: {},
    }

    const invalidFields = Array.from(form.elements).reduce(
      (invalidFields, element) => {
        if (element instanceof HTMLInputElement) {
          const InputInstance = BaseComponent.findParentComponent(
            element as EventTarget,
            children
          )

          fields.values = {
            ...fields.values,
            [`${element.name}`]: element.value,
          }

          const inputProps = InputInstance?.getProps() as InputProps

          if (!inputProps) {
            return invalidFields
          }

          const check = validation.check(
            inputProps.validation as unknown as ValidationProps,
            element.name,
            element.value
          )

          if (check.isValid && element.value) {
            console.log(`%c Field "${element.name}" is valid`, 'color: #50fa7b')
          } else {
            console.log(`%c Invalid field "${element.name}"`, 'color: #ff5555')

            invalidFields = [...invalidFields, element]
          }

          const props = check.isValid
            ? { message: undefined, status: undefined }
            : { status: 'alert', message: check.errorText }

          InputInstance?.setProps({
            value: element.value,
            ...props,
          } as InputProps)

          return invalidFields
        }

        return invalidFields
      },
      [] as HTMLInputElement[]
    )

    const isValidForm = invalidFields.length === 0

    return {
      isValidForm,
      values: fields.values as TFormValues,
    }
  }
}

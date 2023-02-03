import BaseComponent, {
  BaseComponentProps,
  ComponentStatusType,
} from 'components/Base/index'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface InputProps extends BaseComponentProps {
  status?: ComponentStatusType
  name?: string
  type?: HTMLInputElement['type']
  form?: string
  message?: string
  value?: string
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  required?: boolean
}

export default class Input extends BaseComponent<InputProps> {
  protected template = templateString
  protected targetQueryForBrowserEvents = '.input__field'

  constructor(
    props: InputProps = {
      name: '',
    }
  ) {
    super('input', props)
  }

  protected onUpdateProps(
    propKey: keyof InputProps,
    prevValue: unknown,
    newValue: unknown
  ): boolean {
    if (['status', 'value', 'message'].includes(propKey)) {
      console.log('update prop', propKey)
      switch (propKey) {
        case 'message': {
          const inputMessage =
            this.getDOMElement().querySelector('.input__message')

          if (newValue && typeof newValue === 'string') {
            if (inputMessage) {
              inputMessage.textContent = newValue
            } else {
              const message = document.createElement('p')

              message.classList.add('input__message')
              message.textContent = newValue

              this.getDOMElement()?.appendChild(message)
            }
          } else {
            inputMessage?.remove()
          }

          break
        }

        case 'status': {
          if (typeof newValue === 'string') {
            const input = this.getDOMElement()
            const value = `input_${
              newValue
                ? newValue
                : typeof prevValue === 'string'
                ? prevValue
                : ''
            }`

            newValue
              ? input.classList.add(value)
              : input.classList.remove(value)
          }
          break
        }

        case 'value': {
          if (typeof newValue === 'string') {
            this.getEventTarget<HTMLInputElement>().value = newValue
          }
          break
        }

        default:
          break
      }

      return false
    }

    return prevValue !== newValue
  }
}

import BaseComponent, {
  BaseComponentProps,
  BaseComponentOptions,
  ComponentStatusType,
} from 'components/Base/index.'
import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface InputProps extends BaseComponentProps {
  status?: ComponentStatusType
  name: string
  type?: HTMLInputElement['type']
  form?: string
  value?: string
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  required?: boolean
}

export default class Input extends BaseComponent<InputProps> {
  public template = templateString

  constructor(options: BaseComponentOptions = {}) {
    super('input', options)
  }
}

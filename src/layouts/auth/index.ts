import layout from 'bundle-text:./layout.pug'
import AuthModel, { AuthModelProps } from './model'
import { BaseController } from 'core/index'
import './styles.scss'

export default class AuthLayout extends BaseController {
  protected template = layout

  constructor(name: string, props: AuthModelProps) {
    super(
      name,
      {
        pathname: props.pathname,
        screenTitle: props.screenTitle,
      },
      {
        onMount: () => {
          console.log(`Mounted Layout: ${name}`)
        },
        onUpdate: (props) => {
          console.log(`Updated props Layout: ${name}, ${props}`)
        },
      }
    )

    this.modelInstance = new AuthModel(props)
  }
}

import layout from 'bundle-text:./layout.pug'
import PlaceholderModel, { PlaceholderModelProps } from './model'
import { BaseController } from 'core/index'
import './styles.scss'

export default class PlaceholderLayout extends BaseController {
  protected template = layout

  constructor(name: string, props: PlaceholderModelProps) {
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

    this.modelInstance = new PlaceholderModel(props)
  }
}

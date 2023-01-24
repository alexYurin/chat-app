import layout from 'bundle-text:./layout.pug'
import PagesModel, { PagesModelProps } from './model'
import BaseController from 'core/BaseLayout'
import './styles.scss'

export default class PagesLayout extends BaseController {
  protected template = layout

  constructor(name: string, props: PagesModelProps) {
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

    this.modelInstance = new PagesModel(props)
  }
}
